
import * as validateDomain from 'is-valid-domain'
export default {
    methods:{
        min3: v => {
            if (v === undefined)
                return true;
            return v.length >= 3 || 'Field must have more than 3 characters'
        },
        email: function (value,asBool) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (value === undefined)
                return true;

            if (value.length < 1)
                return true;

            if(asBool)
                return re.test(value.toLowerCase())
            return re.test(value.toLowerCase()) || 'Email invalid'
        },
        domainRule: function (value) {
            console.log(value);
            let tmp = value;


            tmp = tmp.replace(/(^\w+:|^)\/\//, '');
            tmp = tmp.trim().toLowerCase();

            console.log(tmp);
            let domainValid = validateDomain(tmp);
            console.log(domainValid);
            return (domainValid || tmp === 'localhost' || tmp === '127.0.0.1') || "Domain name invalid";


        }

    }
}