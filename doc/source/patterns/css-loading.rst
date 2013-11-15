CSS Loading
===========

**Problem:**

Modules can produce some UI that normally requires CSS. In order to make the code modular, this CSS must go in its own file and probably sit next to the javascript file. The problem this poses is that when the module is included in an application, the HTML file has to be modified to include the CSS declaration.

**Solution:**

It can be the responsibility of the programmer to add the ``style`` declaration to the HTML when the module is added (and to remove it when the module is removed!!), but in cases where several parties are adding or removing modules this can be inconvenient.

The best solution is to generate the HTML from the server scanning the module folder for CSS files and rendering ``style`` tags as they are found. Thus, in order to add a new module to the application is enough to drop the .js and .css files in the module application.

Note, however, that in order to load efficiently these .css it is convenient to minify them into a single CSS at deploy time. However, the approach is still valid during development or for third party customizations.