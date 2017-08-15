function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}
// get all data in form and return object
function getFormData() {
  var elements = document.getElementById("gform").elements; // all form elements
  console.log(elements);
  // var arr = ['a', 'b', 'c'];
  // console.log(Object.keys(arr));
  // console: ['0', '1', '2']

  // arreglo como objeto
  // var obj = { 0: 'a', 1: 'b', 2: 'c' };
  // console.log(Object.keys(obj));
  // console: ['0', '1', '2']

  // arreglo como objeto con nombres ordenados aleatoriamente
  // var an_obj = { 100: 'a', 2: 'b', 7: 'c' };
  // console.log(Object.keys(an_obj));
  // console: ['2', '7', '100']

  // getFoo es una propiedad no enumerable
  // var my_obj = Object.create({}, { getFoo: { value: function() { return this.foo; } } });
  // my_obj.foo = 1;
  // console.log(Object.keys(my_obj));
  // console: ['foo']
  var fields = Object.keys(elements).map(function(k) {
    console.log(k);
    if(elements[k].name !== undefined) {
      console.log(elements[k].name);
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      console.log(elements[k].item(0).name);
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    console.log(item);
    console.log(pos);
    console.log(self);
    return self.indexOf(item) == pos && item;
    console.log(self.indexOf(item));
  });
  var data = {};
  console.log(fields);
  fields.forEach(function(k){
    console.log(k);
    data[k] = elements[k].value;
    console.log(data[k]);
    console.log(elements[k].value);
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    console.log(str);
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append
      console.log(str);                                        // the current checked value to
                                              // the end of it, along with
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space
                                  // from the  string to make the output
                                  // prettier in the spreadsheet

                            // Definition and Usage
                            // The slice() method returns the selected elements in an array, as a new array object.
                            //
                            // The slice() method selects the elements starting at the given start argument, and ends at, but does not include, the given end argument.
                            //
                            // Note: The original array will not be changed
                            // Syntax
                            // array.slice(start, end)
                            // Parameter Values
                            // Parameter	Description
                            // start	Optional. An integer that specifies where to start the selection (The first element has an index of 0). Use negative numbers to select from the end of an array. If omitted, it acts like "0"
                            // end	Optional. An integer that specifies where to end the selection. If omitted, all elements from the start position and to the end of the array will be selected. Use negative numbers to select from the end of an array

    }else if(elements[k].length){
      console.log(elements[k].length);
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          console.log(str);
          data[k] = str.slice(0, -2);
          console.log(data[k]);
        }
      }
    }
  });
  console.log(data);
  return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  event.preventDefault();           // we are submitting via xhr below
  var data = getFormData();         // get the values submitted in the form
  if( !validEmail(data.email) ) {   // if email is not valid show error
    document.getElementById('email-invalid').style.display = 'block';
    return false;
  } else {
    var url = event.target.action;  //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        console.log( xhr.status, xhr.statusText )
        console.log(xhr.responseText);
        document.getElementById('gform').style.display = 'none'; // hide form
        document.getElementById('thankyou_message').style.display = 'block';
        return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    //The join() method joins the elements of an array into a string, and returns the string.
    xhr.send(encoded);
  }
}
function loaded() {
  console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);
