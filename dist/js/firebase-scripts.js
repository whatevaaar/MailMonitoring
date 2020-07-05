var firebaseConfig = {
    apiKey: "AIzaSyA9_sYMUtr78YG4FJlx4uzSmKG8zHAXhxc",
    authDomain: "mail-monitoring-ac607.firebaseapp.com",
    databaseURL: "https://mail-monitoring-ac607.firebaseio.com",
    projectId: "mail-monitoring-ac607",
    storageBucket: "mail-monitoring-ac607.appspot.com",
    messagingSenderId: "878058751892",
    appId: "1:878058751892:web:3d12af3b97921f71c77181",
    measurementId: "G-GPSCFX18BT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function insertar() {
    var cuenta = document.getElementById('entrada_cuenta').value;
    var fecha = document.getElementById('input-fecha').value;
    var correosLeidos = document.getElementById('input-correos-leidos').value;
    var correosEnviados = document.getElementById('input-correos-enviados').value;
    firebase.database().ref('cuentas/' + cuenta + '/' + fecha).set({
        fecha: fecha,
        correos_leidos: correosLeidos,
        correos_enviados: correosEnviados,
    }, function (error) {
        if (error)
            console.log(error);
        else {
            mostrarAlertaExito();
            limpiarFormulario();
        }
    });
}

function limpiarFormulario() {
    document.getElementById('input-fecha').value = "";
    document.getElementById('input-correos-leidos').value = "";
    document.getElementById('input-correos-enviados').value = "";
}

function mostrarAlertaExito() {
    $(document).ready(function () {
        $('.alert').show();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false; // Keep close.bs.alert event from removing from DOM
    });
}

