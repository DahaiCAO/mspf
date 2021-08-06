from django.db import models

# Create your models here.

class Plugin(models.Model):
   id = models.CharField('系统标识',max_length=22, primary_key=True)
   name = models.CharField('插件名称',max_length=512,null=True,blank=True)
   developer = models.CharField('开发者',max_length=512,null=True,blank=True)
   pluginVersion = models.CharField('版本',max_length=20,null=True,blank=True)
   pluginDescription = models.CharField('描述',max_length=1024,null=True,blank=True)
   useCounting = models.IntegerField('引用',null=True,blank=True,default=0)
   likeCounting = models.IntegerField('引用',null=True,blank=True,default=0)
   copyright = models.CharField('版权所有',max_length=512,null=True,blank=True)
   keywords = models.CharField('关键词',max_length=512,null=True,blank=True)
   pluginType = models.CharField('插件类型',max_length=32,null=True,blank=True)
   logo = models.CharField('商标',max_length=512,null=True,blank=True)
   defaultOptions = models.CharField('默认参数',max_length=512,null=True,blank=True)
   createDatetime = models.DateTimeField('创建时间', auto_now_add=True,null=True,blank=True)
   lastupdate = models.DateTimeField('最后更新',auto_now=True,null=True,blank=True)
   license = models.CharField('许可证',max_length=512,null=True,blank=True)
   isFree =  models.SmallIntegerField('免费',null=True,blank=True,default=1)
   pricing =  models.DecimalField('价格',max_digits=5, decimal_places=2,null=True,blank=True,default=0.00)
   banned =  models.SmallIntegerField('是否封禁',null=True,blank=True,default=0)
   parent =  models.CharField('父节点',max_length=32,null=True,blank=True)
   currOwner =  models.CharField('当前所有人',max_length=32,null=True,blank=True)
   owner =  models.CharField('组织所有人',max_length=32,null=True,blank=True)

   class Meta:
    db_table = 'Plugin'