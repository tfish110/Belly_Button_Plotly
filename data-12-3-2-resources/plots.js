d3.json("samples.json").then(function(data){
    console.log(data);
});

// Below, we are extracting the metadata of the first
// person in the dataset, as indicated by the zero index 
// position in metadata[0]. We then use the Object.entries() 
// method to return each key-value pair in an array, and the 
// forEach() method to access each element of these pairs.

d3.json("samples.json").then(function(data){
    firstPerson = data.metadata[0];
    Object.entries(firstPerson).forEach(([key, value]) =>
      {console.log(key + ': ' + value);});
});