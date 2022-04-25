let cl = console.log; //=> first class function

// HTTP request call

// GET >> done
// POST >> done
// PATCH >> done
// PUT 
// DELETE >> done

let baseUrl = "https://jsonplaceholder.typicode.com/posts"; // API
const data = document.getElementById("data");
const postsForm = document.getElementById("postsForm");
const title = document.getElementById("title");
const info = document.getElementById("info");
const submitBtn = document.getElementById("submit");
const updateBtn = document.getElementById("update");

let postArray = [];

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// GET

function makeHTTPRequest(method, url, body) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest(); // to create instance
        xhr.open(method, url, true); 
        xhr.onload = function () {
            if ((xhr.status === 200 || xhr.status === 201) && xhr.readyState === 4){
                resolve(xhr.response);
            } else {
                reject("Something Went Wrong");
            }
        };
        xhr.send(body);
    })
}

makeHTTPRequest("GET", baseUrl)
    .then(res => {
        postArray = JSON.parse(res);
        templating(postArray);
    })
    .catch(cl);
// edit
const onEditHandler = eve =>{
    let getID = +eve.getAttribute("data-id");
    cl(getID);
    localStorage.setItem("setID", getID);
    let editPost = postArray.find((obj) => obj.id === getID);
    cl(editPost);
    title.value = editPost.title;
    info.value = editPost.body;
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

const onUpdateHandler = eve =>{
    let obj = {
        title : title.value,
        body : info.value,
    }
    cl(obj);
    let updateID = +localStorage.getItem("setID");
    postArray.forEach(ele =>{
        if(ele.id === updateID){
            ele.title = title.value;
            ele.body = info.value;
        }
    })
    templating(postArray);
    let updateUrl = `${baseUrl}/${updateID}`;
    makeHTTPRequest("PATCH", updateUrl, JSON.stringify(obj));
    postsForm.reset();
    submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
}

const onDeleteHandler = eve =>{
    // cl(eve);
    let getID = +eve.getAttribute("data-id");
    let deletedUrl = `${baseUrl}/${getID}`;
    let updatedArry = postArray.filter(obj => obj.id != getID);
    templating(updatedArry);
    makeHTTPRequest("DELETE", deletedUrl);
    cl(updatedArry);
}

// templating

function templating(arr){
    let result = "";
    arr.forEach((ele) => {
        result += `
        <div class="card mb-4">
            <div class="card-body">
                <h4>${ele.title}</h4>
                <p>${ele.body}</p>
                <p class="text-right">
                    <button class="btn btn-success" data-id="${ele.id}" onclick="onEditHandler(this)">Edit</button>
                    <button class="btn btn-danger" data-id="${ele.id}" onclick="onDeleteHandler(this)">Delete</button>
                </p>
            </div>
        </div>`
    });
    data.innerHTML = result;
}

// POST method

const onPostHandler = (eve) =>{
    eve.preventDefault();
    let obj = {
        title : title.value,
        body : info.value,
        userId : Math.ceil(Math.random() * 10),
        id : uuidv4(),
    }
    postArray.push(obj);
    templating(postArray);
    postsForm.reset();
    makeHTTPRequest("POST", baseUrl, JSON.stringify(obj));
}


updateBtn.addEventListener("click", onUpdateHandler)
postsForm.addEventListener("submit", onPostHandler);