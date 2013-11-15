Data populating events
----------------------

Scenario: we have:

- A dynamic list of modules to be loaded by the main module. The list of modules can be provided by the server.
- A module that must be executed when all UI modules have been initialized because it will populate them through the message bus.

**Problem:**

The populating module should specify a dependency on all UI modules, but as the list is dynamic, and a new UI component can appear at any time, it is not possible to specify these dependencies

**Solution:**

Load all the modules in any order and manage the order through the bus. This way the application initialization can be done in as many steps as desired: core, install ui, data population, actions that require the data population, etc. After each phase a message is sent to the bus and the component listening the message executes it's initialization code and sends a new event again.