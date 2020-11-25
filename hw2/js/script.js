const width = 1000;
const height = 500;
const margin = 30;
const svg  = d3.select('#scatter-plot')
            .attr('width', width)
            .attr('height', height);

let xParam = 'fertility-rate';
let yParam = 'child-mortality';
let radius = 'gdp';
let year = '2000';

const params = ['child-mortality', 'fertility-rate', 'gdp', 'life-expectancy', 'population'];
const colors = ['aqua', 'lime', 'gold', 'hotpink']

const x = d3.scaleLinear().range([margin*2, width-margin]);
const xLable = svg.append('text').attr('transform', `translate(${width/2}, ${height})`);
const xAxis = svg.append('g').attr('transform', `translate(0, ${height-margin})`);

const y = d3.scaleLinear().range([height-margin, margin]);
const yLable = svg.append('text').attr('transform', `translate(${margin/2}, ${height/2}) rotate(-90)`);
const yAxis = svg.append('g').attr('transform', `translate(${2 * margin}, 0)`);

const color = d3.scaleOrdinal(colors);
const r = d3.scaleSqrt().range([1, 10]);

d3.select('#radius')
                    .selectAll('option')
                    .data(params)
                    .enter()
                    .append('option')
                    .text(function (r) {return r})
                    .attr("selected", function(elem) {
                                                    if (elem == xParam) 
                                                    return true;});

d3.select('#x')
            .selectAll('option')
            .data(params)
            .enter()
            .append('option')
            .text(function (x) {return x})
            .attr("selected", function(elem) {
                                            if (elem == xParam) 
                                            return true;});

d3.select('#y')
            .selectAll('option')
            .data(params)
            .enter()
            .append('option')
            .text(function (y) {return y})
            .attr("selected", function(elem) {
                                            if (elem == yParam)
                                            return true;});

loadData().then(data => {
    let val = 
        d3.nest()
          .key(function (elem) {return elem['region'];})
          .entries(data);

    color.domain(val);
    console.log(data)

    d3.select('.slider').on('change', newYear);
    d3.select('#radius').on('change', newRadius);
    d3.select('#x').on('change', newX);
    d3.select('#y').on('change', newY);

    function newYear(){
        year = this.value;
        updateChart()
    }
    function newRadius(){
        radius = this.value;
        updateChart()
    }
    function newX(){
        xParam = this.value;
        updateChart()
    }
    function newY(){
        yParam = this.value;
        updateChart()
    }

    function updateChart(){
        d3.select('.year').text(year);

        xLable.text(xParam);
        let xRange = data.map(d=> +d[xParam][year]);
        x.domain([d3.min(xRange), d3.max(xRange)]);
        xAxis.call(d3.axisBottom(x));    

        yLable.text(yParam);
        let yRange = data.map(d=> +d[yParam][year]);
        y.domain([d3.min(yRange), d3.max(yRange)]);
        yAxis.call(d3.axisBottom(y));

        let rRange = data.map(d=> +d[radius][year]);
        r.domain([d3.min(rRange), d3.max(rRange)]);

        svg.selectAll('circle')
           .data(data)
           .join('circle')
           .attr('r', function(elem) {return r(+elem[radius][year]); })
           .attr('cx', function(elem) {return x(+elem[xParam][year]); })
           .attr('cy', function(elem) {return y(+elem[yParam][year]); })
           .attr('fill', function(elem) {return color(elem['region']); });     
    }
    
    updateChart();
});


async function loadData() {
    const population = await d3.csv('data/pop.csv');
    const rest = { 
        'gdp': await d3.csv('data/gdppc.csv'),
        'child-mortality': await d3.csv('data/cmu5.csv'),
        'life-expectancy': await d3.csv('data/life_expect.csv'),
        'fertility-rate': await d3.csv('data/tfr.csv')
    };
    const data = population.map(d=>{
        return {
            geo: d.geo,
            country: d.country,
            region: d.region,
            population: {...d},
            ...Object.values(rest).map(v=>v.find(r=>r.geo===d.geo)).reduce((o, d, i)=>({...o, [Object.keys(rest)[i]]: d }), {})
            
        }
    })
    return data
}