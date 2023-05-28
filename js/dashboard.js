/* Represents an element in the dashboard */
class DashboardElement {
    constructor(title, data, id, observation){
        this.title = title;
        this.data = data;
        this.id = id;
        this.observation = observation;
    }

    /* Get the div with the observations */
    getObservation(){
        const observation_div = document.createElement('div');
        observation_div.classList.add("observation");
        if(Array.isArray(this.observation)){
            for(let i = 0; i < this.observation.length; i++){
                const message = document.createElement('p');
                message.textContent = `${'*'.repeat(i+1)} ${this.observation[i]}`;
                observation_div.appendChild(message);
            }
        }else{
            const message = document.createElement('p');
            message.textContent = `* ${this.observation}`;
            observation_div.appendChild(message);
        }
        return observation_div;
    }
}

/* Represents a single metric (number or text) in the dashboard */
class MetricElement extends DashboardElement {

    /* Get the div with the metric */
    getElementDiv(){
    
        const div = document.createElement('div');
        const title = document.createElement('h3');
        const value = document.createElement('p');
    
        div.id = this.id;
        title.textContent = this.title;
        value.textContent = this.data;
    
        div.appendChild(title);
        div.appendChild(value);
    
        if(this.observation){
            const div_observation = this.getObservation();
            div.appendChild(div_observation);
        }
    
        return div;
    }
}

/* Represents a table in the dashboard */
class TableElement extends DashboardElement {

    getElementDiv(){

        const div = document.createElement('div');
        const title = document.createElement('h3');
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        const tbody = document.createElement('tbody');
        
        div.id = this.id;
        title.textContent = this.title;

        /* Inserting Header */
        this.data.columns.forEach(column => {
            const th= document.createElement('th');
            th.textContent = column;
            trHead.appendChild(th);
        })
        thead.appendChild(trHead);
        table.appendChild(thead);
        
        /* Inserting Body */
        for(let rowIndex = 0; rowIndex < this.data.shape[0]; rowIndex++){
            const tr = document.createElement("tr");
            
            const values = this.data.iloc({rows: [rowIndex]}).values[0];
            for(let columnIndex = 0; columnIndex < values.length; columnIndex++){
                const td = document.createElement("td");
                td.textContent = values[columnIndex];
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        div.appendChild(title);
        div.appendChild(table);

        if(this.observation){
            const div_observation = this.getObservation();
            div.appendChild(div_observation);
        }

        return div;
    }
}

/* Represents a plot in the dashboard */
class PlotElement extends DashboardElement {

    constructor(title, data, id, type, observation, layout={}, options={}){
        super(title, data, id, observation);
        this.type = type;
        this.layout = layout;
        this.options = options;
    }

    renderPlot(){
        switch(this.type.toLowerCase()){
            case 'bar':
                this.data.plot(`${this.id}_plot`).bar({layout: this.layout, options: this.options});
                break;
            case 'table':
                this.data.plot(`${this.id}_plot`).table({layout: this.layout, options: this.options});
                break;
        }
    }

    getElementDiv(){
    
        const div = document.createElement('div');
        const title = document.createElement('h3');
        const plot = document.createElement('div');
    
        div.id = this.id;
        div.classList.add('plot');
        if(this.title){
            title.textContent = this.title;
            div.appendChild(title);
        }
        plot.id = `${this.id}_plot`;
    
        div.appendChild(plot);
    
        if(this.observation){
            const div_observation = this.getObservation();
            div.appendChild(div_observation);
        }

        return div;
    }
}
