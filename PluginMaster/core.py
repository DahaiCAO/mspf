

from os import name


class PaaSEntity():
    id = None
    name = None
    owner = None
    currOwner = None

    def __repr__(self): #相当于toString
        repr({
            self.id, 
            self.name, 
            self.owner, 
            self.currOwner
            })

class TreeNode(PaaSEntity):
    parent = None
    children = []

    def __repr__(self): #相当于toString
        repr({
            self.id, 
            self.name, 
            self.owner, 
            self.currOwner,
            self.parent, 
            self.children
            })


class FileFolderMenuItem(TreeNode):
    badgeClass = None
    badgeNum = 0
    grantOperations = None
    icon = None
    inUse = 0
    menuItemType = 0 # 1 means folder;0 means file
    orderNumber = None
    systemLevel = 0
    targetId = None
    lastModified = -1
    size = ""
    expended = 0
    description = ""
    context = ""
    dirName = ""

    def __repr__(self): #相当于toString
        repr({
            self.id,
            self.name,
            self.owner,
            self.currOwner,
            self.parent,
            self.children,
            self.badgeClass, 
            self.expended,
            self.badgeNum, 
            self.grantOperations, 
            self.icon, 
            self.inUse, 
            self.menuItemType, 
            self.orderNumber, 
            self.systemLevel,
            self.targetId,
            self.size,
            self.lastModified,
            self.context,
            self.description,
            self.dirName,
            })

class MainframeConfig(PaaSEntity):
    topbar = None
    sidebar = None

    def __repr__(self): #相当于toString
        repr({
            self.topbar,
            self.sidebar,
        })
