const LISTA_DE_CLIENTES = ['Iberdrola', 'ICA', 'Newmont', 'Newmont Brend', 'Vitalmex', 'Chemours', 'Farmacias del Ahorro', 'Cementos Moctezuma',
  'Canon', 'Element', 'José Cuervo', 'Mitsubishi', 'Dell EMC', 'Caden', 'Axalta', 'Emilio Moro', 'EY', 'Siemens',
  'Panamericansilver', 'Anafapyt', 'Mckinsey', 'IDEI', 'Del Fuerte', 'CORONOVIRUS INDUSTRIAS', 'GBM TEMPORAL', 'Cuervo Especial',
  'CanastaXmexico', 'ADI', 'Edenred', 'CENACED', 'Fundary', 'Stendhalpharma y Maypo'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'April', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']


$(function () {

  'use strict'

  // Make the dashboard widgets sortable Using jquery UI
  $('.connectedSortable').sortable({
    placeholder: 'sort-highlight',
    connectWith: '.connectedSortable',
    handle: '.card-header, .nav-tabs',
    forcePlaceholderSize: true,
    zIndex: 999999
  })
  $('.connectedSortable .card-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move')

  // jQuery UI sortable for the todo list
  $('.todo-list').sortable({
    placeholder: 'sort-highlight',
    handle: '.handle',
    forcePlaceholderSize: true,
    zIndex: 999999
  })

  // bootstrap WYSIHTML5 - text editor
  $('.textarea').summernote()

  $('.daterange').daterangepicker({
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: moment().subtract(29, 'days'),
    endDate: moment()
  }, function (start, end) {
    window.alert('You chose: ' + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
  })

  /* jQueryKnob */
  $('.knob').knob()


  // The Calender
  $('#calendar').datetimepicker({
    format: 'L',
    inline: true
  })

  // SLIMSCROLL FOR CHAT WIDGET
  $('#chat-box').overlayScrollbars({
    height: '250px'
  })

  /* Chart.js Charts */

})

var datosGraficaMailingEnviados = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var datosGraficaMailingLeidos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var datosGraficaMailingEnviadosSemanal = [0, 0, 0, 0, 0, 0, 0];
var datosGraficaMailingLeidosSemanal = [0, 0, 0, 0, 0, 0, 0];
var datosGraficaTasa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function actualizar(nombre) {

  datosGraficaMailingEnviados = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  datosGraficaMailingLeidos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  datosGraficaTasa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  document.getElementById('entrada_cuenta').value = nombre;
  firebase.database().ref('cuentas/' + nombre + '/').on("value", snap => {
    let totalEnviados = 0;
    let totalLeidos = 0;
    snap.forEach(element => {
      let dato = element.val();
      actualizarDatasets(dato);
      totalEnviados += Number(dato.correos_enviados);
      totalLeidos += Number(dato.correos_leidos);
    });
    document.getElementById("tasa-mensual").value = datosGraficaTasa[new Date().getMonth()];
    document.getElementById("tasa-maxima").value = Math.max.apply(Math, datosGraficaTasa);
    document.getElementById("tasa-promedio").value = (datosGraficaTasa.reduce((a, b) => (a + b)) / 12).toFixed(1);
    document.getElementById("tasa-apertura").innerHTML = (((totalLeidos / totalEnviados) * 100).toFixed(2)).toString() + '%';
    document.getElementById("correos-enviados-h3").innerHTML = totalEnviados;
    document.getElementById("correos-leidos-h3").innerHTML = totalLeidos;
    actualizarGraficas();

  });
}

function actualizarDatasets(dato) {
  let fecha = crearFecha(dato.fecha);
  let index = fecha.getMonth()
  datosGraficaMailingLeidos[index] += Number(dato.correos_leidos);
  datosGraficaMailingEnviados[index] += Number(dato.correos_enviados);
  datosGraficaTasa[index] = Number(((datosGraficaMailingLeidos[index] / datosGraficaMailingEnviados[index]) * 100).toFixed(2));
}

function crearFecha(fecha) {
  let partes = fecha.split('-');
  return new Date(partes[0], partes[1] - 1, partes[2]);
}

function actualizarFecha(fecha) {
  let nuevaFecha = fecha.getAttribute("data-day");
  console.log(fecha.getAttribute("data-day"));
  let partes = nuevaFecha.split('/');
  var inputFecha = partes[2] + "-" + partes[0] + "-" + partes[1];
  $('#input-fecha').val(inputFecha);
  actualizarFormulario();
}

function actualizarFormulario() {
  var cuenta = document.getElementById('entrada_cuenta').value;
  var fecha = document.getElementById('input-fecha').value;
  firebase.database().ref('cuentas/' + cuenta + '/' + fecha).on("value", snap => {
    if (snap.exists()) {
      let dato = snap.val();
      document.getElementById('input-correos-leidos').value = dato.correos_leidos;
      document.getElementById('input-correos-enviados').value = dato.correos_enviados;
    }
   else{
     
      document.getElementById('input-correos-leidos').value = "";
      document.getElementById('input-correos-enviados').value = "";
   } 
  });
}

function actualizarGraficas() {

  var salesChartCanvas = document.getElementById('revenue-chart-canvas').getContext('2d');
  var salesGraphChartCanvas = $('#line-chart').get(0).getContext('2d');
  var pieChartCanvas = $('#sales-chart-canvas').get(0).getContext('2d')
  //$('#revenue-chart').get(0).getContext('2d');

  var salesChartData = {
    labels: MESES,
    datasets: [
      {
        label: 'Correos Leídos',
        backgroundColor: 'rgba(60,141,188,0.9)',
        borderColor: 'rgba(60,141,188,0.8)',
        pointRadius: false,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data: datosGraficaMailingLeidos
      },
      {
        label: 'Correos Enviados',
        backgroundColor: 'rgba(210, 214, 222, 1)',
        borderColor: 'rgba(210, 214, 222, 1)',
        pointRadius: false,
        pointColor: 'rgba(210, 214, 222, 1)',
        pointStrokeColor: '#c1c7d1',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: datosGraficaMailingEnviados
      },
    ]
  }

  var salesChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: true
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
        }
      }]
    }
  }

  // This will get the first returned node in the jQuery collection.
  var salesChart = new Chart(salesChartCanvas, {
    type: 'line',
    data: salesChartData,
    options: salesChartOptions
  }
  )

  // Donut Chart
  var pieData = {
    labels: [
      'Correos Leídos',
      'Correos Enviados',
    ],
    datasets: [
      {
        data: [datosGraficaMailingLeidos[new Date().getMonth()], datosGraficaMailingEnviados[new Date().getMonth()]],
        backgroundColor: ['#f56954', '#00a65a'],
      }
    ]
  }
  var pieOptions = {
    legend: {
      display: true
    },
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      animateRotate: true,
      animateScale: true
    }
  }
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  var pieChart = new Chart(pieChartCanvas, {
    type: 'doughnut',
    data: pieData,
    options: pieOptions
  });

  // Sales graph chart
  //$('#revenue-chart').get(0).getContext('2d');

  var salesGraphChartData = {
    labels: MESES,
    datasets: [
      {
        label: 'Tasa de Apertura',
        fill: false,
        borderWidth: 2,
        lineTension: 0,
        spanGaps: true,
        borderColor: '#efefef',
        pointRadius: 3,
        pointHoverRadius: 7,
        pointColor: '#efefef',
        pointBackgroundColor: '#efefef',
        data: datosGraficaTasa
      }
    ]
  }

  var salesGraphChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [{
        ticks: {
          fontColor: '#efefef',
        },
        gridLines: {
          display: false,
          color: '#efefef',
          drawBorder: false,
        }
      }],
      yAxes: [{
        ticks: {
          stepSize: 10,
          fontColor: '#efefef',
        },
        gridLines: {
          display: true,
          color: '#efefef',
          drawBorder: false,
        }
      }]
    }
  }

  // This will get the first returned node in the jQuery collection.
  var salesGraphChart = new Chart(salesGraphChartCanvas, {
    type: 'line',
    data: salesGraphChartData,
    options: salesGraphChartOptions
  }
  )
}