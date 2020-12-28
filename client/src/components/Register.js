// /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/

import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axios } from '../core/axios';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import EmailIcon from '@material-ui/icons/Email';

import { toast } from 'react-toastify';

import './css/Form.css';

const RegisterSchema = yup.object().shape({
    name: yup.string()
        .required("Inserisci un nome.")
        .matches(/^([A-Z][a-z]{2,})\s([A-Z]([\s']?[A-Za-z])*)$/, "Inserisci un nome valido."),
    email: yup.string()
        .required("Inserisci un'email.")
        .email("Email non valida."),
    password: yup.string()
        .required("Inserisci una password.")
        .min(5, "La password deve contenere almeno 5 caratteri.")
        .max(12, "La password può contenere al massimo 12 caratteri."),
    cpassword: yup.string()
        .required("Conferma la password.")
        .oneOf([yup.ref('password'), null], 'Le due password non coincidono.'),
});

export default function Register() {

    const history = useHistory();
    const handleSubmit = (values) => {
        axios.post("/user/register", {
            name: values.name,
            email: values.email,
            password: values.cpassword
        })
        .then(res => {
            toast.info("Registrazione effettuata.");
            history.push("/login");
        })
        .catch(err => toast.error(err.response.data))       
    }
    const formik = useFormik({ 
        initialValues: {email: "", password:"", name: "", cpassword: ""},
        validationSchema: RegisterSchema,
        onSubmit: values => handleSubmit(values)
    });

    return (
        <div className="form__container">
            <h1>Crea account</h1>
            <form onSubmit={formik.handleSubmit}>

            <span>Il tuo nome</span>
                <div className={formik.errors.name && formik.touched.name ? "form__input__group error" : "form__input__group"}>
                    <AccountCircleIcon />
                    <input 
                        name="name"
                        id="name"
                        type="text" 
                        placeholder="Nome Cognome"
                        value={formik.values.name} 
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        autoComplete="off"
                    />
                </div>
                {formik.errors.name && formik.touched.name && <div className="form__input__error">{formik.errors.name}</div>}

                <span>Indirizzo email</span>
                <div className={formik.errors.email && formik.touched.email ? "form__input__group error" : "form__input__group"}>
                    <EmailIcon />
                    <input 
                        name="email"
                        id="email"
                        type="text" 
                        placeholder="Email"
                        value={formik.values.email} 
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        autoComplete="off"
                    />
                </div>
                {formik.errors.email && formik.touched.email && <div className="form__input__error">{formik.errors.email}</div>}

                <span>Password</span>
                <div className={formik.errors.password && formik.touched.password ? "form__input__group error" : "form__input__group"}>
                    <LockIcon />
                    <input 
                        name="password"
                        id="password"
                        type="password" 
                        placeholder="Password" 
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                </div>
                {formik.errors.password && formik.touched.password && <div className="form__input__error">{formik.errors.password}</div>}

                <span>Conferma Password</span>
                <div className={formik.errors.cpassword && formik.touched.cpassword ? "form__input__group error" : "form__input__group"}>
                    <LockIcon />
                    <input 
                        name="cpassword"
                        id="cpassword"
                        type="password" 
                        placeholder="Conferma Password" 
                        value={formik.values.cpassword}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                    />
                </div>
                {formik.errors.cpassword && formik.touched.cpassword && <div className="form__input__error">{formik.errors.cpassword}</div>}

                <button className="form__button" type="submit" disabled={!formik.dirty}>Invia</button>
            </form>

            <div className="form__info">
                <Link to="/login">
                    <ArrowRightIcon /> Se sei già registrato, clicca qui
                </Link>
                Registrandoti dichiari di aver letto e accetti integralmente le nostre Condizioni generali di 
                uso e vendita. Prendi visione della nostra Informativa sulla privacy, della nostra Informativa 
                sui Cookie e della nostra Informativa sulla Pubblicità definita in base agli interessi.
            </div>
        </div>
    );
}