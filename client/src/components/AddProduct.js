import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { axios } from '../core/axios';
import NumberFormat from 'react-number-format';

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import TitleIcon from '@material-ui/icons/Title';
import EuroIcon from '@material-ui/icons/Euro';
import ShowChartIcon from '@material-ui/icons/ShowChart';

import ProductViewer from './ProductViewer';
import { categoryList } from './useful/Categories';

import './css/Form.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { toast } from 'react-toastify';

const FILE_SIZE = '200000'; //200 KB - unità di misura: BYTE
const SUPPORTED_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];
const MIN_DATE = new Date(new Date().valueOf() - 1000 * 3600 * 24);

const ImageSchema = yup.object().shape({
    img: yup.mixed() 
        .required("Inserisci almeno una foto.")
        .test('fileSize', "File troppo grande. (max 200 kb)", value => value !== undefined && value.size <= FILE_SIZE) 
        .test('fileType', "Estensione non supportata. (.png .jpg .jpeg)", value => value !== undefined && SUPPORTED_FORMATS.includes(value.type))
})

const DiscountSchema =  yup.object().shape({
    discount: yup.number()
        .min(5, "Lo sconto dev'essere di almeno del 5%")
        .max(75, "Lo sconto può essere al massimo del 75%"),
    discount_start: yup.date() 
        .min(MIN_DATE, "Non puoi inserire una data precedente a quella di oggi."),
    discount_end: yup.date()
        .test('maxDate', "La data non può essere uguale o minore a quella d'inizio", function(value) {
            if(this.parent.discount_start === undefined || this.parent.discount_start.valueOf() < 0 || value < 0 || value === undefined)return true;
            let date_min = this.parent.discount_start.valueOf() + 1000 * 3600 * 24;
            let val = value.valueOf();
            return val >= date_min;
        })
})

const ProductSchema = yup.object().shape({
    category: yup.number()
        .required("Scegli una categoria.")
        .min(1, "Il prodotto deve appartenere ad una categoria."),
    price: yup.number()
        .required("Inserisci un prezzo per il prodotto.")
        .min(1, "Il prezzo non può essere inferiore a 1.")
        .max(10000, "Il prezzo non può essere maggiore a 10.000,00 €"),
    units: yup.number()
        .required("Inserisci il numero di unità disponibili per la vendita.")
        .min(1, "Devi avere almeno un'unità del prodotto."),
    title: yup.string()
        .required("Inserisci un nome prodotto.")
        .min(5, "Il titolo dev'essere lungo almeno 5 caratteri."),
    description: yup.string()
        .required("Inserisci una descrizione.")
        .min(200, "Devi inserire almeno 200 caratteri per la descrizione.")
});

export default function AddProduct() {

    const [images, uploadImage] = useState([]);
    const [imgContainer, setImgContainer] = useState();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const history = useHistory();
    
    const steps = [1, 2, 3];
    const [step, setStep] = useState(1);

    const updateEditor = (editorState) => {
        setEditorState(editorState);
        stepOne.setFieldValue("description", editorState.getCurrentContent().getPlainText());
    }
    const deleteImage = () => {
        let index = images.indexOf(imgContainer);
        images.splice(index, 1);
        let next = (index === images.length) ? index - 1 : index;
        setImgContainer(images[next]);
        if(!images.length) stepThree.setFieldValue("img", null);
    }
    const addImage = (img) => {
        if(img === null)return false;
        ImageSchema.isValid({ img: img }).then(res => {
            if(res === false) return toast.error("Inserisci un'immagine valida.");

            let reader = new FileReader();
            reader.onloadend = () => {
                const obj = {
                    url: reader.result, 
                    file: img
                };
                if(images.some(x => x.url === obj.url))return toast.error("Immagine già caricata.");
                uploadImage(images => [...images, obj]);
                stepThree.setFieldValue("img", img);
                stepThree.setSubmitting(false);
            } 
            reader.readAsDataURL(img);
        });
    }
    const onSubmit = () => {
        let data = new FormData();
        let descriptionRow = convertToRaw(editorState.getCurrentContent());

        images.map((x, i) => data.append(i, x.file));
        data.append("title", stepOne.values.title);
        data.append("price", stepOne.values.price);
        data.append("units", stepOne.values.units);
        data.append("discount", stepTwo.values.discount);
        data.append("discount_start", stepTwo.values.discount_start);
        data.append("discount_end", stepTwo.values.discount_end);
        data.append("category", stepOne.values.category);
        data.append("description", JSON.stringify(descriptionRow));

        axios.post("/products/add", data)
            .then(() => {
                toast.info("Prodotto pubblicato!");
                stepOne.resetForm({});
                stepTwo.resetForm({});
                stepThree.resetForm({});
                setStep(3);
                history.push('/');
            })
            .catch(err => toast.error(err.response.data));
    }
    const stepOne = useFormik({ 
        initialValues: {
            title: "", 
            price: 0, 
            units: 1, 
            category: "",
            description: ""
        },
        validationSchema: ProductSchema,
        onSubmit: () => setStep(2)
    });
    const stepTwo = useFormik({
        initialValues: {
            discount: "", 
            discount_start: "", 
            discount_end: ""
        },
        validationSchema: DiscountSchema,
        onSubmit: () => setStep(3)
    });
    const stepThree = useFormik({
        initialValues: {img: null},
        validationSchema: ImageSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: () => onSubmit()       
    });

    return (
        <div className="form__container">
            <h1>Aggiungi prodotto</h1>

            <div className="form__stepper">
                {steps.map(x => 
                    <React.Fragment key={x}>
                        <span className={step > x ? "form__stepper__number active" : "form__stepper__number"}>
                            <button 
                                type="button" 
                                onClick={() => step > x && setStep(x)}
                            >
                                {x}
                            </button>
                        </span>
                        {x < steps.length && <div className={step > x ? "form__stepper__separator active" : "form__stepper__separator"} />} 
                    </React.Fragment>
                )}
            </div>

            {step === 1 &&
                <form onSubmit={stepOne.handleSubmit}>

                    <span className="form__container__title">Nome</span>
                    <div className={stepOne.errors.title && stepOne.touched.title ? "form__input__group error" : "form__input__group"}>
                        <TitleIcon />
                        <input 
                            name="title"
                            id="title"
                            type="text" 
                            placeholder="Nome prodotto"
                            value={stepOne.values.title}
                            onChange={stepOne.handleChange}
                            onBlur={stepOne.handleBlur}
                            autoComplete="off"
                        />
                    </div>
                    {stepOne.errors.title && stepOne.touched.title && <div className="form__input__error">{stepOne.errors.title}</div>}

                    <span className="form__container__title">Categoria</span>
                    <div className={stepOne.errors.category && stepOne.touched.category ? "form__input__group error" : "form__input__group"}>
                        <select 
                            name="category"
                            id="category"
                            type="text" 
                            value={stepOne.values.category}
                            onChange={stepOne.handleChange}
                            onBlur={stepOne.handleBlur}
                        >
                            {categoryList.map(
                                (x, i) => 
                                    <option value={i} key={i}>
                                        {x}
                                    </option>
                            )}
                        </select>
                    </div>
                    {stepOne.errors.category && stepOne.touched.category && <div className="form__input__error">{stepOne.errors.category}</div>}

                    <span className="form__container__title">Prezzo e unità</span>
                    <div className={(stepOne.errors.price && stepOne.touched.price) || (stepOne.errors.units && stepOne.touched.units) ? "form__input__group error" : "form__input__group"}>
                        <EuroIcon />
                        <NumberFormat 
                            name="price"
                            id="price"
                            value={stepOne.values.price} 
                            allowLeadingZeros={false} 
                            allowNegative={false} 
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            displayType={'input'}
                            isNumericString={true}
                            allowEmptyFormatting={true}
                            onValueChange={val => stepOne.setFieldValue('price', val.floatValue)}
                            onBlur={stepOne.handleBlur}
                        />
                        <ShowChartIcon />
                        <input 
                            name="units"
                            id="units"
                            type="number" 
                            placeholder="Unità disponibili"
                            value={stepOne.values.units}
                            onChange={stepOne.handleChange}
                            onBlur={stepOne.handleBlur}
                            min={1}
                        />
                    </div>
                    {stepOne.errors.price && stepOne.touched.price && <div className="form__input__error">{stepOne.errors.price}</div>}
                    {stepOne.errors.units && stepOne.touched.units && <div className="form__input__error">{stepOne.errors.units}</div>}

                    <span className="form__container__title">Descrizione</span>
                    <div>
                        <Editor
                            value={stepOne.values.description}
                            editorState={editorState}
                            wrapperClassName={stepOne.errors.description && stepOne.touched.description ? "form__editor__wrapper error" : "form__editor__wrapper"}
                            editorClassName={"form__editor__content"}
                            toolbar={{
                                inline: { 
                                    inDropdown: true,
                                    options: ['bold', 'italic', 'underline', 'strikethrough']
                                },
                                fontSize: {options: [11, 12, 14, 16, 18, 24]},
                                blockType: {options: ['Normal', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code']},
                                list: {inDropdown: true},
                                textAlign: {inDropdown: true},
                                link: {inDropdown: true},
                                options: ['inline', 'fontSize', 'blockType', 'list', 'textAlign', 'emoji', 'history']
                            }}
                            onEditorStateChange={(editorState) => updateEditor(editorState)}
                            onBlur={() => stepOne.setFieldTouched("description")}
                        />
                        {stepOne.errors.description && stepOne.touched.description && <div className="form__input__error">{stepOne.errors.description}</div>}
                    </div>

                    <button className="form__button" type="submit" disabled={!(stepOne.isValid && stepOne.dirty)}>Continua</button>
                </form>
            }

            {step === 2 &&
                <form onSubmit={stepTwo.handleSubmit}>

                    <span className="form__container__title">Sconto programmato</span>
                    <div className={stepTwo.errors.discount && stepTwo.touched.discount ? "form__input__group error" : "form__input__group"}>
                        <input 
                            name="discount"
                            id="discount"
                            value={stepTwo.values.discount} 
                            placeholder="Percentuale di sconto"
                            type="number"
                            onChange={stepTwo.handleChange}
                            onBlur={stepTwo.handleBlur}
                        />
                    </div>
                    {stepTwo.errors.discount && stepTwo.touched.discount && <div className="form__input__error">{stepTwo.errors.discount}</div>}

                    <div className={(stepTwo.errors.discount_start && stepTwo.touched.discount_start) || (stepTwo.errors.discount_end && stepTwo.touched.discount_end) ? "form__input__group error" : "form__input__group"}>
                        <input 
                            name="discount_start"
                            id="discount_start"
                            type="date" 
                            value={stepTwo.values.discount_start}
                            onChange={stepTwo.handleChange}
                            onBlur={stepTwo.handleBlur}
                        />
                        <input 
                            name="discount_end"
                            id="discount_end"
                            type="date" 
                            value={stepTwo.values.discount_end}
                            onChange={stepTwo.handleChange}
                            onBlur={stepTwo.handleBlur}
                        />
                    </div>
                    {stepTwo.errors.discount_start && stepTwo.touched.discount_start && <div className="form__input__error">{stepTwo.errors.discount_start}</div>}
                    {stepTwo.errors.discount_end && stepTwo.touched.discount_end && <div className="form__input__error">{stepTwo.errors.discount_end}</div>}

                    <button className="form__button" type="submit" disabled={!stepTwo.isValid}>Continua</button>
                </form>
            }

            {step > 2 &&
                <form onSubmit={stepThree.handleSubmit}>
                    <span className="form__container__title">Immagini</span>
                    <div className={stepThree.errors.img ? "form__input__group error" : "form__input__group"}>
                        <label htmlFor="img">
                            {stepThree.values.img !== null ? stepThree.values.img.name : "Aggiungi un'immagine"}
                        </label>
                        <input 
                            name="img"
                            id="img"
                            type="file" 
                            onChange={e => addImage(e.currentTarget.files[0])}
                            accept=".png, .jpg, .jpeg"
                            style={{display: 'none'}}
                        />
                    </div>
                    {stepThree.errors.img && <div className="form__input__error">{stepThree.errors.img}</div>}
    
                    {images.length > 0 && <ProductViewer images={images} imgContainer={imgContainer || images[0]} setImgContainer={setImgContainer} deleteImage={deleteImage} />}
                
                    <button className="form__button" type="submit" disabled={!(stepThree.isValid && stepThree.dirty)/* || stepThree.isSubmitting*/}>Pubblica</button>
                </form>
            }
        </div>
    );
}