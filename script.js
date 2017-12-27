window.onload = function() {

    let rr = 20; // refresh rate in seconds
    let mode = 'btc';

    setupTime();

    let price = new Vue({
        el: '#priceBanner',
        data: {
            currentPrice: 0,
            animatedPrice: 0,
            currency: 'Bitcoin'
        },
        watch: {
            currentPrice: function(newValue, oldValue) {
                var vm = this;
                function animate () {
                    if (TWEEN.update()) {
                        requestAnimationFrame(animate);
                    }
                }
                new TWEEN.Tween({ tweeningNumber: oldValue })
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .to({ tweeningNumber: newValue }, 600)
                    .onUpdate(function () {
                        vm.animatedPrice = this.tweeningNumber.toFixed(2);
                    })
                    .start();

                animate();
            }
        }
    });

    let toggle = new Vue({
        el: '#switch',
        data: {
            isBTC: true
        },
        methods: {
            turnOnBTC() {
                document.getElementById('btc').setAttribute('class','btn btn-primary-outline on');
                document.getElementById('eth').setAttribute('class','btn btn-primary-outline');
                price.currency = 'Bitcoin';
                mode = 'btc';
                getCurrentPrice(mode, price);
            },
            turnOnETH() {
                document.getElementById('btc').setAttribute('class','btn btn-primary-outline');
                document.getElementById('eth').setAttribute('class','btn btn-primary-outline on');
                price.currency = 'Ethereum';
                mode = 'eth';
                getCurrentPrice(mode, price);
            }
        }
    });

    //price.currentPrice = 15000;
    getCurrentPrice(mode, price);
    setInterval(function() {
        //price.currentPrice += 100;
        getCurrentPrice(mode, price);
    }, rr * 1000);


}


function getCurrentPrice(coin, vue) {
    let http = new XMLHttpRequest();
    let cors_proxy = 'https://cors-anywhere.herokuapp.com/';
    if (coin == 'btc') {
        var api = cors_proxy + 'https://api.cryptowat.ch/markets/gdax/btcusd/price';
    } else if (coin == 'eth') {
        var api = cors_proxy + 'https://api.cryptowat.ch/markets/gdax/ethusd/price';
    }
    http.open("GET", api, true);
    http.onload = function() {
        var data = JSON.parse(http.responseText);
        vue.currentPrice = data.result.price;
    }
    http.send();
}

function setupTime() {
    var monthArr = ['January','February','March','April','May','June',
                    'July','August','Septermber','October','November','December'];
    var time = new Vue({
        el: '#myTime',
        data: {
            date: '',
            time: ''
        }
    });
    var today = new Date();

    var month = today.getMonth();
    var day = today.getDate();
    var year = today.getFullYear();

    var h = twelve(today.getHours());
    var m = pad(today.getMinutes());
    var s = pad(today.getSeconds());

    time.date = monthArr[month] + ' ' + day + ', ' + year;
    time.time = h[0] + ':' + m + ':' + s + ' ' + h[1];
    setInterval(function() {
        today = new Date();
        h = twelve(today.getHours());
        m = pad(today.getMinutes());
        s = pad(today.getSeconds());

        time.time = h[0] + ':' + m + ':' + s + ' ' + h[1];
    }, 1000);   
}

function pad(number) {
    var padded = '00' + number;
    return padded.substring(padded.length - 2);
}
function twelve(hour) {
    if (hour > 12) {
        hour -= 12;
        var m = 'PM';
    } else {
        var m = 'AM';
    }
    hour = (hour == 0) ? 12 : hour;
    return [hour, m];
}
