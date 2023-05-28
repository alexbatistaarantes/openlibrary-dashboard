class OpenLibraryDashboard {
    constructor(div, log) {
        this.div = div;
        this.log = log;
        console.log(log);

        this.elements = [];
    }

    getReport(){
        /* Books read */
        const booksRead = this.log.loc({rows: this.log["Bookshelf"].eq("Already Read")}).Title.count();
        this.elements.push( new MetricElement("Books read", booksRead, 'books-read') );

        /* Want to read */
        const wantToRead = this.log.loc({rows: this.log["Bookshelf"].eq("Want to Read")}).Title.count();
        this.elements.push( new MetricElement("Want to read", wantToRead, 'want-to-read') );

        /* Books read by publish year */
        const booksReadByPublishYear_series = this.log.loc({rows: this.log["Bookshelf"].eq("Already Read")})["First Publish Year"].valueCounts().sortValues({ascending: false});
        const booksReadByPublishYear = new dfd.DataFrame({
            'Publish Year': booksReadByPublishYear_series.index,
            'Quantity': booksReadByPublishYear_series.values
        });
        this.elements.push( new TableElement("Books read by publish year", booksReadByPublishYear, 'books-read-by-publish-year') );
    }

    drawDashboard(){
        this.elements.forEach((element) => {
            const elementDiv = element.getElementDiv();
            this.div.appendChild(elementDiv);

            if(element instanceof PlotElement){
                element.renderPlot();
            }
        })
    }
}

document.querySelector("#create-dashboard-button").addEventListener("click", createDashboard);
async function createDashboard(){
    const log_file = document.querySelector("#reading-log").files[0];
    const log = await getDataframeFromCSVFile(log_file);

    const div = document.querySelector("#dashboard");
    
    const dashboard = new OpenLibraryDashboard(div, log);
    dashboard.getReport();
    dashboard.drawDashboard();
}
