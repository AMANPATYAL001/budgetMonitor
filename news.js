async function getData() {
  const response = await fetch('https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=0254aebaf29b4f92aef1df34a0b016e6')
  const data = await response.json();
  return data;
  // .then((data) => { return data }).catch((error) => {
  // console.log('eRR', error); return 'FAIL';
  // })
}
async function main2() {
  let data = await getData()
  console.log(data)
  if (data == 'FAIL')
    return
  data = data['articles']
  let i = 0
  while (i < data.length) {
    $('#news-offcanvas').append(`
          <div class="row my-2">
            <div class="col-sm-6 m-0">
              <div class="card">
                <img src=${data[i].urlToImage} class="card-img-top" alt="No Image">
                <div class="card-body">
                  <h6 class="card-title">${data[i].title}</h6>
                </div>
                <div class="card-footer text-muted">
                <p>
                    ${data[i].publishedAt}</p>
                </div>
              </div>
            </div>
            <div class="col-sm-6 m-0">
              <div class="card">
                <img src=${data[i + 1].urlToImage} class="card-img-top" alt="No Image">
                <div class="card-body">
                  <h6 class="card-title">${data[i + 1].title}</h6>
                </div>
                <div class="card-footer text-muted">
                <p>
                    ${data[i + 1].publishedAt}</p>
                </div>
              </div>
            </div>
          </div>`);
    i += 2;
  }
  $('#newsGIF').hide()
}
window.addEventListener("DOMContentLoaded", $('#newsBtn').click(() => {
  
  main2()
  
}))