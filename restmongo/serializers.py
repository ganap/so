# -*- coding: utf-8 -*-
from rest_framework_mongoengine import serializers
from mongoengine import fields as me_fields
from rest_framework import serializers as rserializers
import fields

DictField = rserializers.DictField


def ValidatorAlwaysPass(value):
    pass


class ModelEmbeddedSerializer(serializers.EmbeddedDocumentSerializer):

    """
        bug in djangorest. 2 methods that doesnt exists.
    """

    def _include_additional_options(self, *args, **kwargs):
        return self.get_extra_kwargs()

    def _get_default_field_names(self, *args, **kwargs):
        return self.get_field_names(*args, **kwargs)


class ModelSerializer(serializers.DocumentSerializer):

    """
        Для того чтоб сохранять в ListField объекты DBref.
        В классе Meta нужно добавить словарь с объявлением
        названия самого поля и типа объекта внутри него:

        class Meta:
            model=model.User
            list_fields={'friends':model.User,
                         'pictures':model.Picture,
                         'numbers': int,
                        }
        Также можно будет указать специальные действия для объектов
        в listField, например перемещение объекта из альбома в
        субальбом:
            list_actions={
                            '>>':self.movePicture,
                }
        теперь запись
            ['>>8299djfjdseue772ds88d;<current_folder_type>;<current_oid>;<dest_folder_type>;<dest_oid>']
        вызовет метод self.movePicture с параметрами:

            self.movePicture(instance, value)

    """

    def addToListField(self, instance, field, value, value_type=None):
        """
            instance.field=[Dref(User), Dref(User)]

            value="JJSAMIIQOKC28832900"
            value_type=model.User
            ---or:
            value_type=int
        """
        attr = getattr(instance, field, None)
        if not value_type or isinstance(value_type, str):
            attr.append(value)
            return
        if isinstance(value_type, (int, long, float)):
            attr.append(value_type(value))
            return
        # value_type is model class, and we add DBref
        obj = value_type.objects(pk=value)
        if obj:
            if obj[0] not in attr:
                attr.append(obj[0])

    def removeFromListField(self, instance, field, value, value_type=None):
        """
            instance.field=[Dref(User), Dref(User)]

            value="JJSAMIIQOKC28832900"
            value_type=model.User
            ---or:
            value_type=int
        """
        attr = getattr(instance, field, None)
        if not value_type or isinstance(value_type, str):
            attr.remove(value)
            return
        if isinstance(value_type, (int, long, float)):
            attr.remove(value_type(value))
            return
        # value_type is model class, and we add DBref
        obj = value_type.objects(pk=value)
        if obj:
            attr.remove(obj[0])

    def get_fields(self):
        self.field_mapping[me_fields.PointField] = fields.PointField
        return super(ModelSerializer, self).get_fields()

    def update_PointFields(self, instance, data):
        """
            Обновляет значения у PointField. data - грязный словарь
            с ключом и значением поля.
            После вызова этого метода можно вызывать:
                self.is_valid()
                self.update(instance, self.validated_data)
        """
        changed = False
        for key in data.keys():
            value = data[key]
            if isinstance(value, dict):
                coordinates = value.get('coordinates', None)
                if isinstance(coordinates, list):
                    changed = True
                    setattr(instance, key, coordinates)
                    del data[key]
        if changed:
            instance.save()
        return data

    def update(self, instance, validated_data):
        serializers.raise_errors_on_nested_writes('update',
                                                  self,
                                                  validated_data)

        list_fields = getattr(self.Meta, 'list_fields', {})
        list_actions = getattr(self.Meta, 'list_actions', {})

        try:
            del validated_data['pk']
        except:
            pass

        for attr, value in validated_data.items():
            if attr in list_fields.keys():
                if isinstance(validated_data[attr], list):
                    values_list = validated_data[attr]
                else:
                    values_list = validated_data[attr].replace("[", "")\
                        .replace("]", "")\
                        .replace('"', '')
                    values_list = values_list.split(",")

                for value in values_list:
                    processed = False
                    try:
                        for key in list_actions.keys():
                            if value.startswith(key):
                                list_actions[key](instance, value)
                                processed = True
                        if not isinstance(value, str):
                            # it's dbref, so we save to field all value_list, and
                            # go from for
                            setattr(instance, attr, values_list)
                            break
                        if value.startswith("-"):
                            # try to remove object with oid from field==attr:
                            self.removeFromListField(instance, attr,
                                                     value[1:],
                                                     list_fields[attr])
                        elif not processed:
                            self.addToListField(instance, attr,
                                                value,
                                                list_fields[attr])
                    except:
                        pass

            else:
                setattr(instance, attr, value)
        instance.save()

        return instance

    def create(self, validated_data):
        """
            fix save PointField
        """
        data = {}
        for key in validated_data.keys():
            value = validated_data[key]
            if isinstance(value, dict):
                coordinates = value.get('coordinates', None)
                if isinstance(coordinates, list):
                    data[key] = coordinates
                    del validated_data[key]
        instance = super(ModelSerializer, self).create(validated_data)
        for key in data.keys():
            value = data[key]
            setattr(instance, key, value)
        instance.save()
        return instance
        # return self.Meta.model.objects(pk=instance.pk)[0]

    """
        bug in djangorest. 2 methods that doesnt exists.
    """

    def _include_additional_options(self, *args, **kwargs):
        return self.get_extra_kwargs()

    def _get_default_field_names(self, *args, **kwargs):
        return self.get_field_names(*args, **kwargs)
