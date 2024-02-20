var app = new Vue ({
    el: "#app-container",
    data:{
        homepage: 'Browse Lessons',
        cartpage: 'Shopping Cart',
        showProduct: true,
        term: '',
        user:{
            name: '',
            phone: '',
        },
        lessons:[],
        cart: [],
        sort: {
            sortingMethod: "location",
            sortingOrder: "ascending",
        },
    },
    methods: {
        // Adds Product to cart
           addToCart: function (_id) {
            const itemIndex = this.cart.findIndex(item => item._id === _id);
            if (itemIndex != -1) {
                this.cart[itemIndex].availablespace += 1;
            } else {
                this.cart.push({ _id: _id, availablespace:  1 });
            }
        },
        addLessonToCart: function (_id) {
            console.log("inside");
                const lessonIndex = this.lessons.findIndex(lesson => lesson._id === _id);
                if (lessonIndex != -1) {
                    this.lessons[lessonIndex].availablespace -= 1;
                    this.addToCart(_id);
                }
            },
        // Removes an item from the cart
        removeFromCart: function(index){
            this.cart[index].availablespace = this.cart[index].availablespace - 1;
            const lessonIndex = this.lessons.findIndex(lesson => lesson._id === this.cart[index]._id);
            if (lessonIndex != -1) {
                this.lessons[lessonIndex].availablespace += 1;
            }
            if (this.cart[index].availablespace == 0) {
                this.cart.splice(index, 1);
            }

            console.log(this.cart);
        },
        // Checks the amount of each product in the cart
        canAddToCart(lesson){
            return lesson.availablespace > this.cartCount(lesson);
        },
        // Returns the number of a product type in the cart
        cartCount(id){
            let count = 0;
            for(let i = 0; i < this.cart.length; i++){
                if(this.cart[i] === id){
                    count++;
                }
            }
            return count;
        },
        // Display shopping cart page
        showShoppingCartPage: function(){
            this.showProduct = this.showProduct ? false : true;
        },
        // Search For lessons
        searchLessons: function(){
            // this.lessons = lessons;
            this.lessons = this.lessons.filter(lesson => lesson.subject.toLowerCase().includes(this.term) == true || lesson.location.toLowerCase().includes(this.term));
        },
        fetchLesson: function (_id) {
            const lessonIndex = this.lessons.findIndex(lesson => lesson._id === _id);
            if (lessonIndex == -1) {
                return;
            }
            return this.lessons[lessonIndex];
        },
        submitForm(user) {
            alert('Cheers '+ user.name + ' ,your order has been successfully submitted');   
        },
        checkOut: function () {
            fetch('https://cw2-backend.onrender.com/collection/products/order', {
                method: 'POST', // set the HTTP method as 'POST'
                headers: {
                    'Content-Type': 'application/json', // set the data type as JSON
                },
                body: JSON.stringify({ name: this.user.name, phone: this.user.phone, lessons: this.cart }), // need to stringify the JSON object
            })
                .then(response => response.json())
                .then(responseJSON => {
                    console.log('Success:', responseJSON);
                });

            for (let index = 0; index < this.cart.length; index++) {
                const lesson = this.fetchLesson(this.cart[index].lessonID);
                fetch(`https://cw2-backend.onrender.com/collection/products${lesson._id}`, {
                    method: 'PUT', // set the HTTP method as 'POST'
                    headers: {
                        'Content-Type': 'application/json', // set the data type as JSON
                    },
                    body: JSON.stringify({ availablespace: lesson.availablespace }), // need to stringify the JSON object
                })
                    .then(response => response.json())
                    .then(responseJSON => {
                        console.log('Success:', responseJSON);
                        submitForm()
                    });
            }

            swal({
                title: "Check out successful",
                text: "Your order has been submitted",
                icon: "success",
            });

            this.showProduct = true;
            this.cart = [];


        },
        
    },
    computed: {
        //returns length of the cart items
            cartItemCount: function() {
                return this.cart.length || "";
            },
            sortedLessons(lessons, sort){
                //the comparison that defines the order

                if(this.sort.sortingMethod == "location" && this.sort.sortingOrder === "ascending" ){
                function compare (a, b){
                    if (a.location > b.location) return 1;
                    if (a.location < b.location) return -1;
                    return 0;
                }
                
                }else if(this.sort.sortingMethod == "location" && this.sort.sortingOrder === "descending" ){
                    function compare (a, b){
                        if (a.location < b.location) return 1;
                        if (a.location > b.location) return -1;
                        return 0;
                    }
                }else if(this.sort.sortingMethod === "price" && this.sort.sortingOrder === "ascending" ){
                    function compare (a, b){
                        if (a.price > b.price) return 1;
                        if (a.price < b.price) return -1;
                        return 0;
                    }
                }else if(this.sort.sortingMethod === "price" && this.sort.sortingOrder === "descending" ){
                    function compare (a, b){
                        if (a.price < b.price) return 1;
                        if (a.price > b.price) return -1;
                        return 0;
                    }
                }else if(this.sort.sortingMethod == "subject" && this.sort.sortingOrder === "ascending" ){
                    function compare (a, b){
                        if (a.subject > b.subject) return 1;
                        if (a.subject < b.subject) return -1;
                        return 0;
                    }
                }else if(this.sort.sortingMethod == "subject" && this.sort.sortingOrder === "descending" ){
                    function compare (a, b){
                        if (a.subject < b.subject) return 1;
                        if (a.subject > b.subject) return -1;
                        return 0;
                    }
                }else if(this.sort.sortingMethod == "availablespace" && this.sort.sortingOrder === "ascending" ){
                    function compare (a, b){
                        if (a.availablespace > b.availablespace) return 1;
                        if (a.availablespace < b.availablespace) return -1;
                        return 0;
                    }
                }else if(this.sort.sortingMethod == "availablespace" && this.sort.sortingOrder === "descending" ){
                    function compare (a, b){
                        if (a.availablespace < b.availablespace) return 1;
                        if (a.availablespace > b.availablespace) return -1;
                        return 0;
                    }
                }
                    //sort 'productArray' array and return it
                    return this.lessons.sort(compare);
            },
            
            
    },
    created() {
        fetch("https://coursework-env.eba-qzgh8hw3.eu-west-2.elasticbeanstalk.com/collection/products")
        .then(response => response.json())
        .then(data => (this.lessons = data));
      }
})