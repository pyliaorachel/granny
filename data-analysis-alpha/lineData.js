var dates = ["January", "February", "March", "April", "May", "June", "July"];
var angerData = [65, 59, 80, 81, 56, 55, 40];
var contemptData = [1, 2, 3, 4, 5, 6, 7];
var disgustData = [8, 9, 10, 11, 12, 13, 14];
var fearData = [11, 22, 33, 44, 55, 66, 77];
var happinessData = [71, 62, 53, 44, 35, 26, 17];
var neutralData = [10, 20, 30, 40, 50, 60, 70];
var surpriseData = [60, 60, 50, 50, 40, 40, 30];
var sadnessData = [99, 34, 77, 63, 10, 9, 57];

var data = {
    labels: dates,
    datasets: [
        {
            label: "Anger",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(233,30,99,0.4)",
            borderColor: "rgba(233,30,99,1)",
            pointBorderColor: "rgba(233,30,99,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(233,30,99,1)",
            pointRadius: 1,
            pointHitRadius: 10,
            data: angerData
        },{
            label: "Contempt",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255,87,34,0.4)",
            borderColor: "rgba(255,87,34,1)",
            pointBorderColor: "rgba(255,87,34,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(255,87,34,1)",
            pointRadius: 1,
            pointHitRadius: 10,
            data: contemptData
        },{
            label: "Disgust",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(139,195,154,0.4)",
            borderColor: "rgba(139,195,154,1)",
            pointBorderColor: "rgba(139,195,154,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(139,195,154,1)",
            pointRadius: 1,
            pointHitRadius: 10,
            data: disgustData
        },{
            label: "Fear",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(244,67,54,0.4)",
            borderColor: "rgba(244,67,54,1)",
            pointBorderColor: "rgba(244,67,54,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(244,67,54,1)",
            pointRadius: 1,
            pointHitRadius: 10,
            data: fearData
        },{
            label: "Happiness",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255,193,7,0.4)",
            borderColor: "rgba(255,193,7,1)",
            pointBorderColor: "rgba(255,193,7,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(255,193,7,1)",
            pointRadius: 1,
            pointHitRadius: 10,
            data: happinessData
        },{
            label: "Neutral",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(0,150,136,0.4)",
            borderColor: "rgba(0,150,136,1)",
            pointBorderColor: "rgba(0,150,136,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(0,150,136,1)",
            pointRadius: 1,
            pointHitRadius: 10,
            data: neutralData
        },{
            label: "Surprise",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(255,235,59,0.4)",
            borderColor: "rgba(255,235,59,1)",
            pointBorderColor: "rgba(255,235,59,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(255,235,59,1)",
            pointRadius: 1,
            pointHitRadius: 10,
            data: surpriseData
        },{
            label: "Sadness",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(3,169,244,0.4)",
            borderColor: "rgba(3,169,244,1)",
            pointBorderColor: "rgba(3,169,244,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "rgba(3,169,244,1)",
            pointRadius: 1,
            pointHitRadius: 10,
            data: sadnessData
        }
    ]
};

var options = {
    scaleBeginAtZero: true,
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value %>",
};

var ctx = document.getElementById("lineChart").getContext('2d');
var rs = new RangeSliderChart({
    chartData: data,
    chartOpts: options,
    chartType: 'line',
    chartCTX: ctx,
    class: 'my-chart-ranger', // Specifies a custom class you want applied to your sliders
    initial: [3, 10] //Which data points to start the sliders on
})

