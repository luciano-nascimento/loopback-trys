let $catList, $catForm, $catName, $catAge, $catGender, $catBreed, $catId;

let cats;

document.addEventListener('DOMContentLoaded', init, false);
function init() {

    //get the div for cats
    $catList = document.querySelector('#catList');
    //get the form
    $catForm = document.querySelector('#catForm');
    $catId = document.querySelector('#id');
    $catName = document.querySelector('#name');
    $catAge = document.querySelector('#age');
    $catGender = document.querySelector('#gender');
    $catBreed = document.querySelector('#breed');

    $catForm.addEventListener('submit', saveCat, false);

    //listen for editLink clicks
    document.addEventListener('click', editCat, false);

    //listen for deleteLink clicks
    document.addEventListener('click', deleteCat, false);

    loadCats();
}

function loadCats() {

    //new Date is a cache buster
    fetch('/api/cats/?d='+(new Date().getTime()))
    .then(res => res.json())
    .then(res => {
        //copy so we can edit later
        cats = res;
        let s = '';
        res.forEach(cat => {
            s += `
<p>
<b>${cat.name}</b> is ${cat.age} years old and is a ${cat.gender} ${cat.breed}.<br/>
[<a href="" title="Edit this Cat" data-id="${cat.id}" class="editLink">Edit</a>]
[<a href="" title="Delete this Cat" data-id="${cat.id}" class="deleteLink">Delete</a>]
</p>`
        });
        $catList.innerHTML = s;
    });
}

function saveCat(e) {
    e.preventDefault();

    let cat = {
        name: $catName.value,
        age: $catAge.value,
        gender: $catGender.value,
        breed: $catBreed.value
    }

    let method = 'POST';

    // are we editing?
    if($catId.value != '') {
        cat.id = Number($catId.value);
        method = 'PUT';
    }

    fetch('/api/cats/', {
        headers: {
            'Content-Type':'application/json'
        },
        method:method, 
        body:JSON.stringify(cat)
    })
    .then(res => res.json())
    .then(res => {
        console.log('Updated cat', res);
        $catName.value = '';
        $catAge.value = '';
        $catBreed.value = '';
        $catId.value = '';
        loadCats();
    });

}

function editCat(e) {
    if(e.target.className !== 'editLink') return;
    e.preventDefault();
    let id = e.target.dataset.id;
    console.log('Edit cat '+id);
    //find it in the cat list
    cats.forEach(cat => {
        if(cat.id == id) {
            $catId.value = cat.id;
            $catName.value = cat.name;
            $catAge.value = cat.age;
            $catBreed.value = cat.breed;           
            if(cat.gender === 'male') {
                $catGender.selectedIndex = 0;
            } else {
                $catGender.selectedIndex = 1;
            }
        }
    });
}

function deleteCat(e) {
    if(e.target.className !== 'deleteLink') return;
    e.preventDefault();
    let id = e.target.dataset.id;
    console.log('Delete cat '+id);
    //find it in the cat list
    cats.forEach(cat => {
        if(cat.id == id) {

            fetch('/api/cats/'+cat.id, {
                method:'DELETE', 
            })
            .then(res => res.json())
            .then(res => {

                //clean up edit form in case they were editing it
                if($catId.value == cat.id) {
                    $catName.value = '';
                    $catAge.value = '';
                    $catBreed.value = '';
                    $catId.value = '';
                }

                loadCats();

            });
        }

    });
}