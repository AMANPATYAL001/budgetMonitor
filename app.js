const ctx1 = document.getElementById('myChart1').getContext('2d');
const ctx2 = document.getElementById('myChart2').getContext('2d');
const ctx3 = document.getElementById('myChart3').getContext('2d');
const firebaseConfig = {
    apiKey: "AIzaSyAHMHAHTCMnkxL_N2zLyA52QliQtk5jaqQ",
    authDomain: "budgetmonitor-68d6a.firebaseapp.com",
    projectId: "budgetmonitor-68d6a",
    storageBucket: "budgetmonitor-68d6a.appspot.com",
    messagingSenderId: "407945418401",
    appId: "1:407945418401:web:03595ae744328b452fc2e0",
    measurementId: "G-8D67WHMPXL"
};
let getInfo;
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function setData() {
    // let info = getEP();
    let uid = localStorage.getItem('UID');
    // console.log(uid);
    let dbUsers = db.collection('users')
    await getContent();
    // console.log(getInfo);
    let objArray = getInfo;
    if (objArray === undefined) {
        console.log("undefin", objArray);
        objArray = { 'Data': [document.getElementById('content').value] }
    }
    else {
        let max = -1;
        for (const iterator of objArray['Data']) {
            if (max < iterator.id)
                max = iterator.id
        }
        // let xLabel = objArray['Data'].map(obj => new Date(obj.dateTime).getDate() + ' ' + months[new Date(obj.dateTime).getMonth()]);
        date = new Date();
        let dateString = `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.toLocaleTimeString()}`;
        //    console.log(dateString,{"id":max+1,"dateTime":dateString,price:Number(document.getElementById('amount-no').value),"type":document.getElementById('type-name').value});

        objArray['Data'].push({ "id": max + 1, "dateTime": dateString, price: Number(document.getElementById('amount-no').value), "type": document.getElementById('type-name').value })
    }
    dbUsers.doc(uid).set(objArray).then((para) => {
        // console.log(para)
        // console.log(document.getElementById('content').value)
    })
        .catch((err) => {
            console.log(err)
        })
}

document.getElementById('saveBtn').addEventListener('click', setData);

async function getContent() {
    let uid = localStorage.getItem('UID');
    // console.log(uid);
    let dbUsers = await db.collection('users')
    await dbUsers.doc(uid).get().then((para) => {
        console.log(para.data(), 'DATA')
        getInfo = para.data();
        // return para.data();
    }).catch((err) => {
        console.log(err)
    })
}

// document.getElementById('getConten').addEventListener('click', getContent)


// $( document ).ready(function() {
async function main() {
    // const response = await fetch('data.json');
    // let data = await response.json();
    await getContent();
    let data = getInfo;
    console.log(data);   // array of objects
    data = data['Data']
    // let priceArray = []
    // let typeArray = []
    let priceTypeObj = {};
    for (let i = 0; i < data.length; i++) {
        // typeArray.push(data[i].type)
        // priceArray.push(data[i].price);
        if (!priceTypeObj[data[i].type])
            priceTypeObj[data[i].type] = data[i].price;
        else
            priceTypeObj[data[i].type] = priceTypeObj[data[i].type] + data[i].price;
    }
    // console.log(priceTypeObj);

    const myChart1 = new Chart(ctx1, {
        options: {
            responsive: true,
        },
        data: {
            datasets: [{
                type: 'bar',
                label: 'Bar Dataset',
                data: Object.values(priceTypeObj),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }, {
                type: 'line',
                label: 'Average Price',
                backgroundColor: ['rgba(255,0,0)'],
                borderColor: ['rgba(0,255,0)'],
                data: Array(Object.values(priceTypeObj).length).fill(Object.values(priceTypeObj).reduce((a, b) => a + b, 0) / Object.values(priceTypeObj).length),
            }],
            labels: Object.keys(priceTypeObj)
        }
    })

    const myChart2 = new Chart(ctx2, {
        type: 'doughnut',
        options: {
            responsive: true,
        },
        data: {
            labels: Object.keys(priceTypeObj),
            datasets: [{
                label: 'Average Price',
                data: Array(Object.values(priceTypeObj).length).fill(Object.values(priceTypeObj).reduce((a, b) => a + b, 0) / Object.values(priceTypeObj).length),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }

    })

    for (let i of Object.keys(priceTypeObj)) {
        option = $(`<option value="${i}">${i}</option>`)
        $('#types').append(option)
    }
    $('#types').change(function () {
        console.log('change', $(this).val());

    })

    $('#saveBtn').on('click', () => {
        console.log('save btn clicked');

        console.log($('#type-name').val(), $('#amount-no').val(), Date(), $('#types').val())
    })

    // $('#addData').popover({
    //     trigger: 'hover',
    //     content: 'Add Data',
    //     delay: { "show": 100, "hide": 300 },
    // })

    // let dateToObj={}
    for (let i of data) {
        // console.log(i.dateTime);
        // dateToObj[i.dateTime]=i;
    }
    // console.log(dateToObj);

    data.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.dateTime) - new Date(a.dateTime);
    });
    // console.log(data);

    // const d = new Date();
    // let day = days[d.getDay()];
    // days[new Date(obj.dateTime).getDay()]

    let xLabel = data.map(obj => new Date(obj.dateTime).getDate() + ' ' + months[new Date(obj.dateTime).getMonth()]);
    let yLabel = data.map(obj => obj.price)
    let typeName = data.map(obj => obj.type)

    // console.log(names);
    const myChart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: xLabel,
            datasets: [{
                pointStyle: 'circle',
                radius: 6,
                hoverRadius: 10,
                backgroundColor: 'white',
                fill: {

                    target: 'origin',
                    above: '#ceebdd',   // Area will be red above the origin
                    below: '#fbd4d9'    // And blue below the origin
                },
                label: 'Price',
                data: yLabel,
                // borderColor:
                //                 function(context) {
                //                     // console.log(context.raw);

                //                     let bordercolor= context.raw>0? 'lightgreen':'black';
                //                     // console.log(bordercolor);
                //                     return {
                //                         borderColor: bordercolor,
                // }}}]
            }]
        },
        options: {

            responsive: true,


            plugins: {
                tooltip: {
                    cornerRadius: 6,
                    backgroundColor: '#FAFAFA',
                    titleColor: '#000000',
                    borderColor: 'rgba(0,128,0,1)',
                    usePointStyle: false,
                    borderWidth: 2,
                    callbacks: {
                        title: function (t, d) {
                            return typeName[t[0].dataIndex];
                        },
                        label: function (t, d) {
                            // console.log(t, d);

                            return t.label + ' ' + '$' + t.raw;
                        },
                        labelColor: function (context) {

                            let bordercolor = context.raw > 0 ? 'lightgreen' : 'black';
                            return {
                                borderColor: bordercolor,
                                backgroundColor: 'rgb(255,0,0)',
                                // color:'#000000',
                                borderWidth: 2,
                                borderDash: [2, 2],
                                borderRadius: 2,
                            };
                        },
                        labelTextColor: function (context) {
                            return '#000000';
                        }
                    },

                }
            }
        }
    })
}




window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("gifLoader").style.display = "none";
    document.getElementById("wrapper").style.display = "block";
    main();
});
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(function () {
    $('[data-toggle="popover"]').popover({ sanitize: false })
})

$('.popover-dismiss').popover({
    trigger: 'focus', sanitize: false
})
