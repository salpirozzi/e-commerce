import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axios } from '../core/axios';

import LockIcon from '@material-ui/icons/Lock';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import EmailIcon from '@material-ui/icons/Email';

import { useDispatch } from 'react-redux';
import { login } from '../reducers/userSlice';

import { toast } from 'react-toastify';

import './Form.css';

const LoginSchema = yup.object().shape({
    email: yup.string()
        .required("Inserisci un'email.")
        .email("Email non valida."),
    password: yup.string()
        .required("Inserisci una password.")
        .min(5, "La password deve contenere almeno 5 caratteri.")
        .max(12, "La password può contenere al massimo 12 caratteri.")
});

export default function Login() {

    const dispatch = useDispatch();
    const handleSubmit = (values) => {
        axios.post("/user/login", {
            email: values.email,
            password: values.password
        })
        .then(res => {
            dispatch(login(res.data));
            toast.info("Login effettuato.");
        })
        .catch(err => toast.error(err.response.data))       
    }
    const formik = useFormik({ 
        initialValues: {email: "", password:""},
        validationSchema: LoginSchema,
        onSubmit: values => handleSubmit(values)
    });

    return (
        <div className="form__container">
            <h1>Accedi</h1>
            <form onSubmit={formik.handleSubmit}>
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

                <button className="form__button" type="submit" disabled={!formik.dirty}>Invia</button>
            </form>

            <div className="form__info">
                <Link to="/register">
                    <ArrowRightIcon /> Se non sei registrato, clicca qui
                </Link>
                Accedendo al tuo account dichiari di aver letto e accetti le nostre Condizioni generali di uso 
                e vendita. Prendi visione della nostra Informativa sulla privacy, della nostra Informativa sui 
                Cookie e della nostra Informativa sulla Pubblicità definita in base agli interessi.
            </div>
        </div>
    );
}