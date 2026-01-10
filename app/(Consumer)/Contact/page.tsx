
export default function Contact(){
    return(
        <div className="grow text-center text-3xl lg:text-5xl flex flex-col gap-25">
            <p className="Text-Box m-10 lg:mx-50 lg:my-0 border-b-3 border-red-500">
                If you have any questions regarding our products, services, warranties, or delivery 
                availability please feel free to reach out to our team!
            </p>
            <p>Phone #: <a href="tel:505-991-3928" className="text-blue-400">(505)-991-3928</a> </p>
            <p>Email: <a href="mailto:Email@email.com" className="text-blue-400">Email@email.com</a></p>
            <p className="Text-Box m-5 lg:mx-50 lg:my-0 border-t-3 border-red-500">
                Buisness hours: <br/>
                Monday-Friday 9am-5pm<br/>
                Saturday 9am-3pm<br/>
                Sunday CLOSED
            </p>
        </div>
    )
}