var ctx = document.getElementById("myChart4").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["고객1","고객2","고객3","고객4","고객5","고객6","고객7","고객8","고객9"],
    datasets: [{
      label: '분석1',
      backgroundColor: "#8892D6",
      data: [12, 59, 5, 56, 58,12, 59, 87, 45],
    }, {
      label: '분석2',
      backgroundColor: "#45BBE0",
      data: [100, 59, 45, 56, 58,12, 59, 85, 23],
    }, {
      label: '분석3',
      backgroundColor: "#F06292",
      data: [102, 59, 55, 56, 58,12, 59, 65, 51],
    }, {
      label: '분석4',
      backgroundColor: "#78C250",
      data: [10, 59, 24, 56, 58, 12, 59, 12, 74],
    }],
  },
options: {
    tooltips: {
      displayColors: true,
      callbacks:{
        mode: 'x',
      },
    },
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false,
        }
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
        type: 'linear',
      }]
    },
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' },
  }
});

