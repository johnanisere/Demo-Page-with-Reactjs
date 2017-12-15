import React, { Component } from 'react';
import TiSocialFacebook from 'react-icons/lib/ti/social-facebook';
import TiSocialTwitter from 'react-icons/lib/ti/social-twitter';
import FaStar from 'react-icons/lib/fa/star';
import TiSocialInstagram from 'react-icons/lib/ti/social-instagram';
import {connect} from 'react-redux';
import '../style/receipt.css';
import {delete_cart,clear_receipt} from '../data_Container/action/actions';
import {Link} from 'react-router-dom';

class receipt extends Component{
    constructor(props){
        super(props)
        this.gettime=this.gettime.bind(this);
    }
    gettime(){
        const time=new Date();
        let h=parseInt(time.getHours())
        let m=parseInt(time.getMinutes())
        var d=time.getDay()
        if(m>59){
            m-=60
            h+=1
        }
        if(h>=24){
            h-=24
        }
        if (h<10){
            h="0"+h;
            
        }
        if (m<10){
            m='0'+m
            
        }
        var days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

        return  time.getDate()+"/"+time.getMonth()+"/"+time.getFullYear()+", "+days[d-1]+" "+h+ " : "+ m;
    }
    componentWillUnmount(){
        this.props.dispatch(clear_receipt())
        this.props.dispatch(delete_cart())
    }
    render(){
    return(
        <div id="a">
            <div id="b">
                <div id="c">
                    <h2>Thank you for shopping with us</h2>
                    <img src="https://res.cloudinary.com/www-mybukka-com/image/upload/v1513294716/logo-light_xnxon0_rzghhp.png" alt="my-bukka"/>
                </div>
                <div id="d">
                    <img src={this.props.receipt.chefProfilepic} alt="chef"/>
                    <h4>How was your experience?</h4>
                    <span>
                        <FaStar/>
                        <FaStar/>
                        <FaStar/>
                        <FaStar/>
                        <FaStar/>
                    </span>
                </div>
            </div>
            <div id="e">
                <h1><span id="ea">₦</span>{parseInt(this.props.receipt.receipt.total)+parseInt(this.props.receipt.deliveryFee)+parseInt(this.props.receipt.tax)}.00</h1>
                <div id="f" >
                    {Object.keys(this.props.receipt.receipt.cart).map((item,key)=>
                        <h5 key={key}>
                            <span>{item}</span>
                            <span>₦{this.props.receipt.receipt.cart[item].totalCost}.00</span>
                        </h5>
                    )}
                </div>
                <div id="g">
                    <h5>
                    <span>Subtotal</span>
                    <span>₦{this.props.receipt.receipt.total}</span>
                    </h5>
                    <h5>
                    <span>Delivery Fee</span>
                    <span>₦{this.props.receipt.deliveryFee}.00</span>
                    </h5>
                    <h5>
                    <span>Tax</span>
                    <span>₦{this.props.receipt.tax}.00</span>
                    </h5>
                </div>
                <h5>
                <span>Total</span>
                <span>₦{parseInt(this.props.receipt.receipt.total)+parseInt(this.props.receipt.deliveryFee)+parseInt(this.props.receipt.tax)}.00</span>
                </h5>
            </div>

            <div id="h">
                <h6>Order history</h6>
                <h6>business@mybukka.com</h6>
                <h6>+234 708 756 4619</h6>
                <Link to="/"><h5 id="hb" onClick={this.delete_Receipt}><span id="ha">CONTINUE SHOPPING</span></h5> </Link>
                <h1>
                    <span className="so" href="https://www.facebook.com/mybukka"><TiSocialFacebook/></span>
                    <span className="so" href="https://twitter.com/MyBukka"><TiSocialTwitter/></span>
                    <span className="so" href="https://www.instagram.com/mybukka/"><TiSocialInstagram/></span>
                </h1>
            </div>
            <h6 id="i"><span>Visa xxxx</span><span>{this.gettime()}</span></h6>
        </div>
    )
}
}
function mapStateToProps(state){
	return state;
};
export default connect(mapStateToProps)(receipt)