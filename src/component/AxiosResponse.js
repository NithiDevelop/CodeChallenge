import react,{useEffect,useState} from "react";
import axios from '../api/axios';

const AxiosResponse = () =>{
    
    const [data,setData] = useState();
    useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

      const getDetails = async () => {
        try {
            const response = await axios.get('/users')
            isMounted && setData(response.data);
        } catch (err) {
            console.log(err);
        }
      }

      getDetails();

      return(()=>{
          isMounted = false;
          controller.abort();
      })
    }, [])

    const polishedData = (data) => {
        if(data === undefined){
            return []
        }
        const result = data.map((datum)=>{
            const id = datum?.id;
            const name = datum?.name;
            const email = datum?.email;

            return {
                id : id,
                name : name,
                email : email
            }
        })
        return result;
    }

    const Persons = {
       persons : polishedData(data)
    }
    
    //json to xml   
    const OBJtoXML = (obj) => {
        var xml = '';
        for (var prop in obj) {
            xml += "<" + prop + ">";
            if(obj[prop] instanceof Array) {
                for (var array in obj[prop]) {
                    xml += OBJtoXML(new Object(obj[prop][array]));
                }
            } else if (typeof obj[prop] == "object") {
                xml += OBJtoXML(new Object(obj[prop]));
            } else {
                xml += obj[prop];
            }
            xml += "</" + prop + ">";
        }
        var xml = xml.replace(/<\/?[0-9]{1,}>/g,'');
        return xml
    }
    
    const output = OBJtoXML(Persons)


    return(
        <>
        <article>
            <h2>User Details from json</h2>
            {data?.length
                ?
                    (
                        <ul>
                            {Persons.persons.map((person,i)=>(
                                <div key={i} style={{listStyleType:'none'}}>
                                <li>id:{person?.id}</li>
                                <li>name:{person?.name}</li>
                                <li>email:{person?.email}</li>
                                </div>
                            ))}
                        </ul>

                    )
                : <p>no users to display</p>
            }
        </article>
        <article>
        <h2>User Details from json</h2>
            {output?.length ? 
            (
              output 
            ): 'no record'
        }
        </article>
        </>
    )
}

export default AxiosResponse;