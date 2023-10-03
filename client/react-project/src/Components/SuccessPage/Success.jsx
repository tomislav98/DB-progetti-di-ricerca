function SuccessIcon(isSuccessfull) {
    return isSuccessfull ?
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-check2-circle" viewBox="0 0 16 16">
            <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
        </svg>
        :
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ban" viewBox="0 0 16 16">
            <path d="M15 8a6.973 6.973 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8ZM2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Z" />
        </svg>
}

export function Success({ label, helperText, loading, successfull }) {
    return (
        <div className="container py-5">
            <div className="p-5 text-center bg-body-tertiary">
                <svg className="bi mt-5 mb-3" width="48" height="48">
                    <SuccessIcon isSuccessfull={successfull}/>
                </svg>
                <h1 className="text-body-emphasis">{label}</h1>
                <p className="col-lg-6 mx-auto mb-4 text-muted">
                    {helperText}
                </p>
                {loading && (
                    <div>
                        <div className="spinner-grow spinner-grow-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow spinner-grow-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="spinner-grow spinner-grow-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


