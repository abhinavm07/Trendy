export default function SearchBar({
                                      onSubmit,
                                      value,
                                      onChange,
                                      name,
                                      id,
                                      placeholder,
                                      disabled,
                                      type,
                                      icon,
                                      buttonIcon
                                  }) {
    return (
        <>
            <form onSubmit={onSubmit} className='w-full'>
                <div className='form-group'>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="icon-text-input" id="basic-addon1">{icon}</span>
                        </div>
                        <input
                            type={type}
                            placeholder={placeholder}
                            name={name}
                            id={id}
                            value={value}
                            onChange={onChange}
                            className='input  input-info'
                        />
                        <div className='input-group-append'>
                            {buttonIcon && <button type='submit' className='btn searchButton' disabled={disabled}>
                                {buttonIcon}
                            </button>}
                        </div>
                    </div>
                </div>

            </form>
        </>
    );
}