This repository contains public BAS source code.

**How to commit?**

In order to commit, you have to create new branch and then make [merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html) in this repository. Branch name and merge request description must be informative. Description like ```changes``` not allowed.

If you don't have write access permission, please [create fork](https://docs.gitlab.com/ee/user/project/repository/forking_workflow.html) and make a merge request.

**How to build?**

Information about building and running located in [BASBuild](https://gitlab.com/bablosoft/basbuild) repository.

**Where to find new tasks?**

Check [issues](https://gitlab.com/bablosoft/bas/-/issues) section.

**Coding style.**

1.  Write low coupled code. Changing existing source is inevitable, but try to make sure that your changes affect existing functionality as little as possible. Use dependency injection and patterns to achieve that. For example, if you need to extend functionality of existing class, you can implement new functionality in new class instead of modifying old one, and then connect those class instances.
2.  Use comments to explain what are you doing.
3.  If you change certain file, try to keep coding style, naming convention.
4.  Test you code before commit. It is better to spend time for testing, then for resolving issues later.

**Javascript-only development.**

If you are working with javascript most of the time recommended workflow would be following:

1.  Build BAS using ```Development.bat```. See [BASBuild](https://gitlab.com/bablosoft/basbuild) for more details.
2.  Change source code in following folder ```BAS_BUILD_LOCATION/build/development/apps/CURRENT_VERSION/html``` to resolve your tasks.
3.  Run BrowserAutomationStudio.exe in same folder to test your changes. It is sufficient to restart record mode in order to changes take place.
4.  Create new branch in this repository.
5.  Copy ```BAS_BUILD_LOCATION/build/development/apps/CURRENT_VERSION/html``` folder content to ```Solution/ChromeWorker/html```
6.  Create merge request.
  
Debuging user interface is possible by using parameters from [Debug interface](https://i.imgur.com/vFDZ94C.png) settings section.
