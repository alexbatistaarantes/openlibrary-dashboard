/* Load table to Dataframe */
function getDataframeFromCSVFile(file){
    return new Promise((resolve) => {
        
        const df = dfd.readCSV(file)
            .then((df) => {resolve(df)});

    });
}
