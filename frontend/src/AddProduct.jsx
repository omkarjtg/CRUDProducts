import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react';
export default function AddProduct() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [flashMessage, setFlashMessage] = useState(null);

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/addProducts', data);
            setFlashMessage({ type: 'success', message: 'Product added successfully!' });
            reset(); 
        } catch (error) {
            console.error('There was an error adding the product!', error);
            setFlashMessage({ type: 'error', message: 'There was an error adding the product!' });
        }

        setTimeout(() => setFlashMessage(null), 3000);
    };
    return (
        <>
            <h2>Add a product</h2>
            {flashMessage && (
                <div className={`flash-message ${flashMessage.type}`}>
                    {flashMessage.message}
                </div>
            )}
            <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
                <div> 
                    <label className="form-label">
                        Product name:
                    </label>
                    <input className="form-row" type="text" {...register('name', { required: true })} />
                    {errors.name && <span>This field is required</span>}
                </div>
                <div >
                    <label className="form-label" style={{ display: 'inline' }}>
                        Quantity:
                    </label>
                    <input className="form-row" type="number" {...register('quantity', { required: true })} />
                    {errors.quantity && <span>This field is required</span>}
                </div>
                <div >
                    <label className="form-label">
                        Price:
                    </label>
                    <input className="form-row" type="number" step="0.1" {...register('price', { required: true })} />
                    {errors.price && <span>This field is required</span>}
                </div>
                <button className='btn btn-success btn-sm' type="submit">Submit</button>
            </form>
            <a href="/"> <button className='btn btn-secondary btn-sm'>Cancel</button></a>

        </>
    )
}