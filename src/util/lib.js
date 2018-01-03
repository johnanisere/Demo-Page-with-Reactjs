import {	fetch_address, 
            fetch_chef, 
            identify_user, 
            get_chef,
            showsignIn,
            showsignUp,
            get_chef_update_failed,
            updating_user_info,
            signout,
            signup,
            update_cart,
            showaddmenu,
            menuview                } from '../data_Container/action/actions'
import storage from '../data_Container/store'


export default{ 

    toggleSignin:()=>storage.dispatch(showsignIn(storage.getState().page.showsignIn)),

    toggleSignUp:()=>storage.dispatch(showsignUp(storage.getState().page.showsignUp)),

    signin(email,password){
        storage.dispatch(identify_user(email,password))
		.then(()=>storage.dispatch(updating_user_info(storage.getState().user.user.uid)))
		.then(()=>storage.dispatch(showsignIn(storage.getState().page.showsignIn)))
        .catch((e)=>{console.log('Sorry! There was a problem',e)
                    storage.dispatch(showsignIn(storage.getState().page.showsignIn))})
    },

    addmenu(){
        const pole=document.getElementsByTagName("BODY")[0];
		const he=document.getElementById('head')
		if(pole!==null && he!==null){
		if(pole.classList.contains('popups')){
			pole.classList.remove("popups")
			he.classList.remove('scr')
		}else{
			pole.classList.add("popups")
			he.classList.add('scr')
		}
		storage.dispatch(showaddmenu(storage.getState().page.showaddmenu))
		}
    },

    signup(email,firstname,lastname,password,mobile,isCustomer){
		storage.dispatch(signup(email,firstname,lastname,password,mobile,isCustomer))
		.then(()=>storage.dispatch(identify_user(email,password)))
		.then(storage.dispatch(showsignUp(storage.getState().page.showsignUp)))
		.catch((e)=>console.log('Sorry! There was a problem',e))
    },
    signout:()=>storage.dispatch(signout()),

    updateCart(cart){
		storage.dispatch(update_cart(cart))
    },
    deleteCart(food){
		var newCart=storage.getState().cart.cart
		delete newCart[food]
		var cart={}
		cart.cart=newCart
		var total=Object.keys(newCart).map(
            (key,i)=>newCart[key].totalCost).reduce(
                (sum,value)=>sum+value,0).toFixed(2)
        cart.total=total
        this.updateCart(cart)
    },
    quantityUpdate(Quantity,key){
		if(Quantity===""){
			Quantity=0
		}
        var price=parseInt(storage.getState().cart.cart[key].price,10),
        totalCost=price*parseInt(Quantity,10),
        newCart=storage.getState().cart.cart,cart={}
		newCart[key].quantity=parseInt(Quantity,10)
		newCart[key].totalCost=parseInt(totalCost,10)
		var total=Object.keys(newCart).map(
            (key,i)=>newCart[key].totalCost).reduce(
                (sum,value)=>sum+value,0).toFixed(2)
		cart.cart=newCart
		cart.total=total
		this.updateCart(cart)
    },
    async addItem(menu){
        await storage.dispatch(menuview(menu))
		this.addmenu()
    },
    chefcloseby(result){
        var yourChef=result.filter((chef)=>chef.role==="Super Chef")[0];
        if(yourChef){
            var categ=Array.from(new Set(result.filter(
                (chef)=>chef.role==="Super Chef")[0].menu.map(
                    (menu)=>menu.category)))
            var categorizedMenu={}
            //var menuP=yourChef.menu.filter(items=>categ.indexOf(items.category)>-1).filter(item=>item.visibility===true)
            for(var i=0;i<categ.length;i++){
                var menuPerCategory=[];
                yourChef.menu.map(
                    (items)=>{
                    if(items.category===categ[i]){
                    if(items.visibility){
                        //menuPerCategory.push(items);
                    }
                    menuPerCategory.push(items);
                    }})
                if(menuPerCategory.length>0){
                    categorizedMenu[`${categ[i]}`]=menuPerCategory;
                }
            }
            return{
                    menu:categorizedMenu,
                    yourChef:yourChef,
                    categ:Object.keys(categorizedMenu)
                }
        }else{
            return{
                yourChef:{}
            }
        }
    },
    chefResult(latLng){
        storage.dispatch(fetch_chef(latLng))
		.then(()=>{
			if(!Object.keys(this.chefcloseby(storage.getState().chef.chefsInYourArea).yourChef).length){
				var res={
					response:{
						data:""
					}
				}
				res.response.data="No Chefs found around this location"
				storage.dispatch(get_chef_update_failed(res))
			}else{
                storage.dispatch(get_chef(this.chefcloseby(storage.getState().chef.chefsInYourArea)))
			}
			}
		)
		.catch((e)=>console.log('Sorry! There was a problem',e))
    },
    //cart decoration and to notify if cart has items in it
    //_y->id of shopping cart icon container
    addClass(_y){
		const l = document.getElementById(_y);
		const sc=document.getElementsByClassName('shopping-cart');
		const na=document.getElementsByClassName('s-cart');
		if (l!==null & sc!==null){
		if (Object.keys(storage.getState().cart.cart).length){
				for(var i=0;i<sc.length;i++){
				if(!sc[i].classList.contains('color-white')){
					sc[i].classList.add('color-white')
				}
			}
			for(var c=0;c<na.length;c++){
				if(na[c].classList.contains('no-disp')){
					na[c].classList.remove('no-disp')
				}	
			}
			if(!l.classList.contains('s-cart-filled')){
				l.classList.add('s-cart-filled')
			}
		}
		else if(!Object.keys(storage.getState().cart.cart).length){
			for(var i=0;i<sc.length;i++){
				if(sc[i].classList.contains('color-white')){
					sc[i].classList.remove('color-white')
				}
			}
			for(var p=0;p<na.length;p++){
				if(!na[p].classList.contains('no-disp')){
					na[p].classList.add('no-disp')
				}	
			}
				if(l.classList.contains('s-cart-filled')){
					l.classList.remove('s-cart-filled')
					
				}

		}
	}		
    },
    //left-padding fix for certain view state
    floatingpadd(){
		var h= document.getElementById('head');
		if(h.classList.contains('ab')){
			h.classList.remove('ab');
			h.classList.add('bc')
		}
    },
    //onmount cart effects for headers
    //l->id of shopping cart icon container
    cki(l){
        (storage.getState().chef.fetched)?
		(this.addClass(l),
		this.floatingpadd()):
		null
    },
    //displays more menu items
    show(){
		const m=document.getElementById('mt');
		if(m.classList.contains('d')){
			m.classList.remove('d')
		}else{
			m.classList.add('d')
		}
    },
    //highlights selected menu
    changecol(e){
        var category=document.getElementsByClassName("m-categories");
        var uniquecategory=document.getElementsByClassName(e.currentTarget.dataset.categ);
		for(var i=0;i<category.length;i++){
			if(category[i].classList.contains('l-selecting')){
				category[i].classList.remove("l-selecting");
			}
		}
		
		for(var i=0;i<uniquecategory.length;i++){
			uniquecategory[i].classList.add("l-selecting")
		}
    },
    amountofitems(){
        return Object.keys(storage.getState().cart.cart).map(
            (val,key)=>storage.getState().cart.cart[val].quantity).reduce(
                (a,b)=>a+b,0)
    },
}