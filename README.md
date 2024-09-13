# Execute Function from PCF Control on Form Save in Dynamics CRM

This guide explains how to execute a function from a PCF (PowerApps Component Framework) control on the save of a form in Dynamics CRM. The process involves serializing the function using the `Flatted` npm package and handling the function execution in the form script.

## Prerequisites

- Dynamics CRM environment
- PCF control
- `Flatted` npm package

## Steps

### 1. Define Your Function in PCF Component

Define the function you want to execute in your PCF component.

```javascript
function myCustomFunction() {
  console.log("Function executed from PCF control!");
}
### 2.Create an Object and Store the Function as a String
Create an object and store the function as a string value for a key onSaveFnc.

JavaScript
const Flatted = require('flatted');

const functionObject = {
  onSaveFnc: myCustomFunction.toString()
};

// Serialize the object using Flatted
const serializedFunctionObject = Flatted.stringify(functionObject);
### 3. Define an Output Parameter in PCF
Define an output parameter in your PCF control of type SingleLine.Text.

TypeScript
public getOutputs(): IOutputs {
  return {
    functionOutput: serializedFunctionObject
  };
}
### 4. Pass Serialized Version as Input to Output Object Key
Pass the serialized version as input to the output object key functionOutput.

### 5. Add Custom onOutputChangeEvent in Form Script
Inside the form script in Dataverse/Power Platform, add a custom onOutputChangedFunction as an event function on the onOutputChangeEvent of the PCF control.

JavaScript
function onOutputChangeEvent(executionContext) {
  const formContext = executionContext.getFormContext();
  const outputs = formContext.getControl("field-schema-name").getOutputs();
  const deserializedFunctionObject = Flatted.parse(outputs.functionOutput);
  const reconstructedFunction = new Function('return ' + deserializedFunctionObject.onSaveFnc)();
  
  // Execute the reconstructed function
  reconstructedFunction();
}

formContext.getControl("field-schema-name").addOnOutputChange(onOutputChangeEvent);
### 6. Trigger notifyOutputChangedEvent
The above line will execute the onOutputChangedFunction every time a new value is set for the sampleSetField.

### 7. Access Current Output of PCF
Access the current output of the PCF using:

JavaScript
const outputs = formContext.getControl("daudit_officelocation").getOutputs();
Example
Here is an example of the complete setup:

PCF Component
JavaScript
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { Flatted } from 'flatted';

export class MyPCFControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private notifyOutputChanged: () => void;
  private serializedFunctionObject: string;

  constructor() {
    this.myCustomFunction = this.myCustomFunction.bind(this);
  }

  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
    this.notifyOutputChanged = notifyOutputChanged;
    const functionObject = {
      onSaveFnc: this.myCustomFunction.toString()
    };
    this.serializedFunctionObject = Flatted.stringify(functionObject);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.notifyOutputChanged();
  }

  public getOutputs(): IOutputs {
    return {
      functionOutput: this.serializedFunctionObject
    };
  }

  public destroy(): void {}

  private myCustomFunction() {
    console.log("Function executed from PCF control!");
  }
}
Form Script
JavaScript
function onOutputChangeEvent(executionContext) {
  const formContext = executionContext.getFormContext();
  const outputs = formContext.getControl("field-schema-name").getOutputs();
  const deserializedFunctionObject = Flatted.parse(outputs.functionOutput);
  const reconstructedFunction = new Function('return ' + deserializedFunctionObject.onSaveFnc)();
  
  // Execute the reconstructed function
  reconstructedFunction();
}

formContext.getControl("field-schema-name").addOnOutputChange(onOutputChangeEvent);
By following these steps, you can successfully execute a function from a PCF control on the save of a form in Dynamics CRM.

Unknown

This README.md file provides a clear and concise guide to implementing the described functionality, ensurin
