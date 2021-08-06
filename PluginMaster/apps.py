from django.apps import AppConfig

# 这个文件就是一个配置列表，或者读取配置文件。

class PluginmasterConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'PluginMaster'
    version = '0.0.1'
