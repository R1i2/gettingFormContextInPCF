let fContext;
let boolean = false;
function onLoad(executionContext)
{
	const scriptElement = document.createElement("script");
	scriptElement.setAttribute("src","https://cdn.jsdelivr.net/npm/flatted@3.3.1/index.js");
	scriptElement.addEventListener("load",()=>console.log("Flatted is loaded"));
	document.head.appendChild(scriptElement);
	const formContext = executionContext.getFormContext();
	fContext = formContext;
	const webResourceControl = formContext.getControl("WebResource_new_1");
	if (checkNullOrUndefined(webResourceControl)) {
		webResourceControl.getContentWindow().then(
		function (contentWindow) {
			contentWindow.setFormContextGlobal(Xrm,formContext);
		});
	}
	let fieldControl = formContext.getControl("daudit_officelocation");
	fieldControl.addOnOutputChange(onOutputChangeEvent);
}
function checkNullOrUndefined(value){
	return (value!==null && value !==undefined);
}
function onOutputChangeEvent(){
	debugger;
	let control = fContext.getControl("daudit_officelocation");
	let value = control.getOutputs();
	let onDateChanged = value["daudit_officelocation.fieldControl.onDataChanged"];
	let prevValue = value["daudit_officelocation.fieldControl.prevValue"];
	let newValue = value["daudit_officelocation.fieldControl.currValue"];
	let serializedFunction = value["daudit_officelocation.fieldControl.functionOutput"];
	if(prevValue!==null && prevValue !==undefined && newValue !== null && newValue !==undefined && Flatted!==undefined && Flatted!==null)
	{
		let nameValue = `Prev Value - ${prevValue.value}, New Value - ${newValue.value}`;
	    fContext.getAttribute("daudit_name").setValue(nameValue);
		const deserialized = Flatted.parse(serializedFunction.value);
		const reconstructedFunction = new Function('return function ' + deserialized.onSaveFnc)();
		if(!boolean)
		{
			fContext.data.entity.addOnSave((executionContext)=>{
				let formContext = executionContext.getFormContext();
				reconstructedFunction(formContext);
			});
		boolean = true;
		}
	}
	console.log("Output changed on "+onDateChanged);
}
//Output is {"daudit_officelocation.fieldControl.onDataChanged":{"value":"2024-09-13T07:10:09.790Z","type":2},"daudit_officelocation.fieldControl.prevValue":{"value":"Deloitte USI Banglore","type":2},"daudit_officelocation.fieldControl.currValue":{"value":"Deloitte USI Chennai","type":2}}
