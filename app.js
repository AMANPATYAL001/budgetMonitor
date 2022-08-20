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

// $('#saveBtn').on('click', () => {
//     console.log('save btn clicked');

//     console.log($('#type-name').val(), $('#amount-no').val(), Date(), $('#types').val())
// })

function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
    }, {});
}
const dbUsers = db.collection('users')
const uid = localStorage.getItem('UID');

async function setData() {
    // let info = getEP();
    // console.log(uid);
    await getContent();
    let lineX;
    let lineY;
    let currentAmount;
    let objArray = getInfo;
    console.log(objArray);
    date = new Date();
    let dateString = `${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.toLocaleTimeString()}`;
    let dateOnly = date.toDateString().substring(4)
    let DoC;
    if ($('#inlineRadio1').is(':checked')) {
        DoC = 'debit'
    }
    else
        DoC = 'credit'
    // console.log(objArray,' objArray');
    if (Object.keys(objArray).length === 1) {

        // $("#inlineRadio2").prop("checked", true);
        let price = Number(amount = document.getElementById('amount-no').value)
        console.log("undefin", objArray); // put the credit first
        objArray = {
            'Data': [{ id: 0, dateOnly: dateOnly, type: 'credit', price: price, currentAmount: document.getElementById('amount-no').value, dateTime: dateString }]
        }
    }
    else {
        currentAmount = objArray['Data'][objArray['Data'].length - 1].currentAmount
        let max = -1;
        for (const iterator of objArray['Data']) {
            if (max < iterator.id)
                max = iterator.id
        }


        let DoC;
        if ($('#inlineRadio1').is(':checked')) {
            DoC = 'debit'
        }
        else
            DoC = 'credit'
        let amount;
        let type;
        let dropDownTypeVal = $('#types').val()
        let inpTypeVal = $('#type-name').val()
        amount = document.getElementById('amount-no').value
        if (inpTypeVal.trim().toLowerCase() == 'income')
            document.getElementById('typeHelpD').innerText = "can't set debit as 'INCOME' type"
        if (DoC == 'debit') {
            currentAmount = currentAmount - amount
            if (inpTypeVal.trim() == '')
                type = dropDownTypeVal
            else
                type = inpTypeVal
        }
        else {
            currentAmount = currentAmount + Number(amount)

            // amount = 0;
            type = 'credit'  //currentAmount

        }
        if (Number(amount) == 0 || Number(amount)) {
            if (Number(amount) <= 10 && type == 'debit')
                document.getElementById('amountHelp').innerText = 'Amount less than 10 not acceptable'
            else {

                document.getElementById("saveBtn").disabled = true;

                objArray['Data'].push({
                    "id": max + 1, "dateTime": dateString, price: Number(amount), "type": type, 'currentAmount': currentAmount, dateOnly: date.toDateString().substring(4)
                })
                // console.log(objArray['Data']);

            }

        }
        else {
            document.getElementById('amountHelp').innerText = 'Invalid Amount'
        }
    }
    dbUsers.doc(uid).set(objArray).then((para) => {
        // console.log(para)
        // console.log(document.getElementById('content').value)
        document.getElementById("saveBtn").disabled = false;
    })
        .catch((err) => {
            console.log(err)
            document.getElementById("saveBtn").disabled = false;
        })

}
function creditCheck() {
    document.getElementById('types').disabled = true
    document.getElementById('type-name').disabled = true
}
function debitCheck() {
    document.getElementById('types').disabled = false
    document.getElementById('type-name').disabled = false
}

document.getElementById('inlineRadio2').addEventListener('input', creditCheck)
document.getElementById('inlineRadio1').addEventListener('input', debitCheck)

document.getElementById('type-name').addEventListener('input', typeInfo)

function typeInfo() {
    let inpTypeVal = $('#type-name').val()
    if (inpTypeVal.trim() == '' || inpTypeVal.trim().toLowerCase() == 'income')
        $('#typeHelpS').text('')
    else
        $('#typeHelpS').text(`'${inpTypeVal}' will be takes as new Type`)
}

function validateAmount() {
    let amount = document.getElementById('amount-no').value

    if (Number(amount)) {
        document.getElementById('amountHelp').innerText = ''
    } else
        document.getElementById('amountHelp').innerText = 'Invalid Amount'

}

document.getElementById('amount-no').addEventListener('input', validateAmount)

document.getElementById('saveBtn').addEventListener('click', setData);

async function getContent() {
    let uid = localStorage.getItem('UID');
    // console.log(uid);
    let dbUsers = await db.collection('users')
    await dbUsers.doc(uid).get().then((para) => {
        // console.log(para.data(), 'DATA')
        getInfo = para.data();
        // return para.data();
    }).catch((err) => {
        console.log(err)
    })
}

// document.getElementById('getConten').addEventListener('click', getContent)

// function getDeviceInfo() {
//     let uid = localStorage.getItem('UID');
//     // console.log(uid);
//     let dbUsers = await db.collection('users')
//     await dbUsers.doc(uid).get().then((para) => {
//         // console.log(para.data(), 'DATA')
//         getInfo = para.data();
//         // return para.data();
//     }).catch((err) => {
//         console.log(err)
//     })
// }

function setDeviceInfo() {
    let browserName = navigator.userAgentData.brands[2].brand;
    let browserVersion = navigator.userAgentData.brands[2].version;
    let platformName = navigator.userAgentData.platform;
    let loginData = {}
    if (!getInfo.loginInfo) {
        getInfo['loginInfo'] = [{
            'browserName': browserName,
            'browserVersion': browserVersion,
            'platformName': platformName,
            'dateTime': new Date()
        }]
        console.log('1...');
    }
    else
        getInfo.loginInfo.push({
            'browserName': browserName,
            'browserVersion': browserVersion,
            'platformName': platformName,
            'date': new Date().toDateString(),
            'time': new Date().toTimeString()
        })

    dbUsers.doc(uid).set(getInfo).then((para) => {
        // console.log(para)
        // console.log(document.getElementById('content').value)
        document.getElementById("saveBtn").disabled = false;
    })
        .catch((err) => {
            console.log(err)
            document.getElementById("saveBtn").disabled = false;
        })
}

function getSummary(data) {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        if (count == 10) {
            count = 10
            break
        }
        if (data[i].type != 'credit')
            count++


    }
    let expenditure = 0;
    let creditMonth = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].type != 'credit')
            expenditure += data[i].price
    }

    let date = new Date()
    let month = months[date.getMonth()].substring(0, 3)
    let year = date.getFullYear()

    for (let i = data.length - 1; i >= 0; i--) {
        if (/\w{3}\s/.exec(data[i].dateOnly)[0].trim() == month && /\s\d{4}/.exec(data[i].dateOnly)[0].trim() == year && data[i].type == 'credit') {
            creditMonth += data[i].price
        }


    }
    document.getElementById('gistTotal').innerHTML = `Current total Amount is $ <strong>${data[data.length - 1].currentAmount}</strong>`
    document.getElementById('gistPrev10').innerHTML = `Last ${count} expenditure sum is $ <strong>${expenditure}</strong>`
    document.getElementById('gistCreditM').innerHTML = `This month's credit is $ <strong>${creditMonth}</strong>`
}
// $( document ).ready(function() {
async function main() {
    // const response = await fetch('data.json');
    // let data = await response.json();
    await getContent();
    document.getElementById('firstL').style.display = 'none';
    document.getElementById('firstS').style.display = 'none';
    document.getElementById('firstT').style.display = 'none';

    let data = getInfo;
    document.getElementById('gistGIF').style.display = 'none'
    console.log(data.loginInfo)
    // setDeviceInfo();

    if (Object.keys(data).length == 1) {
        $("#inlineRadio2").prop("checked", true);
        $('.noData').show();

        return false
    }
    else if (data.Data.length == 1) {
        // $('.alert').show()
        document.getElementsByClassName('alert')[0].style.display = 'block'
        document.getElementsByClassName('alert')[0].setAttribute('style', 'opacity:1 !important')
        // $('.noData').text('One more entry !')
        // $('.noData').show();
        // return false 
    }
    else {
        // console.log('close');
        document.getElementsByClassName('alert')[0].setAttribute('style', 'opacity:0 !important')
        document.getElementsByClassName('alert')[0].style.display = 'none'
        $('.noData').hide();
    }
    // getDeviceInfo();
    $('#deviceInfo').text(`${getInfo.loginInfo[getInfo.loginInfo.length - 2].browserName} v${getInfo.loginInfo[getInfo.loginInfo.length - 2].browserVersion} ${getInfo.loginInfo[getInfo.loginInfo.length - 2].platformName}`)
    $('#lastLoginTime').text(getInfo.loginInfo[getInfo.loginInfo.length - 2].date+getInfo.loginInfo[getInfo.loginInfo.length - 2].time)
    console.log(getInfo.loginInfo[getInfo.loginInfo.length - 2].time);
    $('.toast').toast('show');


    document.getElementById('myChart1').style.display = 'block';
    document.getElementById('myChart2').style.display = 'block';
    document.getElementById('myChart3').style.display = 'block';
    data = data['Data']
    let lineX = [];
    let lineY = [];
    let lineType = []

    lineX = Object.keys(groupBy(data, 'dateOnly'));
    // console.log(lineX);
    // console.log(groupBy(lineX, 'dateOnly'));
    let totalAmountList = []
    for (let i = 0; i < lineX.length; i++) {
        let a = groupBy(data, 'dateOnly')[lineX[i]]
        // console.log(a);
        let sum = 0
        let strType = '';
        let lowDebit = Infinity;
        for (let j = 0; j < a.length; j++) {
            if (a[j].type !== 'credit') {
                sum += a[j].price
                if (lowDebit > a[j].currentAmount)
                    lowDebit = a[j].currentAmount
                strType += ' ' + a[j].type
            }
            // console.log(data[i],sum)
        }
        totalAmountList.push(lowDebit)
        lineY.push(sum)
        lineType.push(strType)
    }
    // console.log(lineY, lineX);
    // console.log(lineType);

    // console.log(data);   // array of objects
    // document.getElementById('gistCard').style.display = 'block'
    getSummary(data);
    // let priceArray = []
    // let typeArray = []
    let priceTypeObj = {};
    for (let i = 0; i < data.length; i++) {
        // typeArray.push(data[i].type)
        // priceArray.push(data[i].price);
        if (data[i].type != 'credit') {
            if (!priceTypeObj[data[i].type])
                priceTypeObj[data[i].type] = data[i].price;
            else
                priceTypeObj[data[i].type] = priceTypeObj[data[i].type] + data[i].price;
        }
    }
    console.log(priceTypeObj);

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
    // console.log(Array(Object.values(priceTypeObj).length).fill(Object.values(priceTypeObj).reduce((a, b) => a + b, 0) / Object.values(priceTypeObj).length))

    const myChart2 = new Chart(ctx2, {
        type: 'doughnut',
        options: {
            responsive: true,
        },
        data: {
            labels: Object.keys(priceTypeObj),
            datasets: [{
                label: 'Average Price',
                data: Object.values(priceTypeObj),
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
    // $('#types').change(function () {
    //     console.log('change', $(this).val());

    // })

    // $('#addData').popover({
    //     trigger: 'hover',
    //     content: 'Add Data',
    //     delay: { "show": 100, "hide": 300 },
    // })

    // let dateToObj={}
    // for (let i of data) {
    // console.log(i.dateTime);
    // dateToObj[i.dateTime]=i;
    // }
    // console.log(dateToObj);

    // data.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    // return new Date(b.dateTime) - new Date(a.dateTime);
    // });
    // console.log(data);

    // const d = new Date();
    // let day = days[d.getDay()];
    // days[new Date(obj.dateTime).getDay()]

    let xLabel = data.map(obj => new Date(obj.dateTime).getDate() + ' ' + months[new Date(obj.dateTime).getMonth()]);
    let yLabel = data.map(obj => obj.currentAmount)
    let typeName = data.map(obj => obj.type)

    // console.log(names);
    const myChart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: lineX,
            datasets: [{
                pointStyle: 'circle',
                radius: 6,
                hoverRadius: 10,
                backgroundColor: '#ff6384',
                // fill: {

                //     target: 'origin',
                //     above: '#ff6384',   // Area will be red above the origin
                //     below: '#ff6384'    // And blue below the origin
                // },
                label: 'Price',
                data: lineY,
                borderColor: '#ff6384'  //#36a2eb
                // borderColor:
                //                 function(context) {
                //                     // console.log(context.raw);

                //                     let bordercolor= context.raw>0? 'lightgreen':'black';
                //                     // console.log(bordercolor);
                //                     return {
                //                         borderColor: bordercolor,
                // }}}]
            }, {

                pointStyle: 'line',
                radius: 6,
                hoverRadius: 10,
                backgroundColor: 'blue',
                // fill: {

                //     target: 'origin',
                //     above: '#ff6384',   // Area will be red above the origin
                //     below: '#ff6384'    // And blue below the origin
                // },
                label: 'Price',
                data: [300, 100],
                borderColor: '#36a2eb'  //
                // borderColor:
                //                 function(context) {
                //                     // console.log(context.raw);

                //                     let bordercolor= context.raw>0? 'lightgreen':'black';
                //                     // console.log(bordercolor);
                //                     return {
                //                         borderColor: bordercolor,
                // }}}]

            }, {


                pointStyle: 'circle',
                radius: 6,
                hoverRadius: 10,
                backgroundColor: '#36a2eb',
                // fill: {

                //     target: 'origin',
                //     above: '#ff6384',   // Area will be red above the origin
                //     below: '#ff6384'    // And blue below the origin
                // },
                label: 'Price',
                data: [300, 100],
                borderColor: '#36a2eb'  //
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
                    backgroundColor: '#ff6384',
                    titleColor: '#000000',
                    borderColor: '#ff6384',
                    usePointStyle: false,
                    borderWidth: 2,
                    callbacks: {
                        title: function (t, d) {
                            // console.log(t, d);
                            return "Today's:$ " + lineY[t[0].dataIndex];
                        },
                        label: function (t, d) {

                            return lineType[t.dataIndex] + ' Total: ' + totalAmountList[t.dataIndex];
                        },
                        // labelColor: function (context) {

                        //     let bordercolor = context.raw > 0 ? 'lightgreen' : 'black';
                        //     return {
                        //         borderColor: bordercolor,
                        //         backgroundColor: 'rgb(255,0,0)',
                        //         // color:'#000000',
                        //         borderWidth: 2,
                        //         borderDash: [2, 2],
                        //         borderRadius: 2,
                        //     };
                        // },
                        borderColor: '#ff6384',
                        labelTextColor: function (context) {
                            return '#000000';
                        }
                    },

                }
            }
        }
    })
    // console.log(myChart3.data.datasets);
    // console.log(myChart3.data.labels);
}



window.addEventListener("DOMContentLoaded", function () {
    document.getElementById("gifLoader").style.display = "none";
    document.getElementById("wrapper").style.display = "block";

    // if(main()){getContent
    // console.log('again');
//     let hue=0
//     document.getElementById('titleBM').addEventListener('onmouseover',function (){
//         hue+=Math.floor(Math.random() *15);
//         this.style.color='hsl('+hue+',100%,50%)';
// console.log(this);
//     })
    main()
    // }
});


