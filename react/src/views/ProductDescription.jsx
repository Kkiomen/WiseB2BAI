import {useEffect, useState} from "react";
import TagsInput from 'react-tagsinput'
import KeyValue from "../components/form/KeyValue.jsx";
import axiosClient from "../axios-client.js";

export default function ProductDescription(){
  const [subject, setSubject] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [keywordsSEO, setKeywordsSEO] = useState([]);
  const [styleAndTone, setStyleAndTone] = useState([]);
  const [limitations, setLimitations] = useState([]);
  const [material, setMaterial] = useState([]);
  const [usage, setUsage] = useState("");
  const [warranty, setWarranty] = useState("");
  const [uniqueFeatures, setUniqueFeatures] = useState([]);
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState(null);
  const [useHtml, setUseHtml] = useState(false);

  useEffect(() =>{
    console.log(attributes)
  })

  const handleSubmit = async () => {
    const payload = {
      subject,
      productName,
      category,
      attributes,
      targetAudience,
      keywords,
      keywordsSEO,
      imageUrl: "https://example.com/image.jpg",
      useHtml,
      styleAndTone,
      limitations,
      material,
      usage,
      warranty,
      uniqueFeatures,
      description,
    };
    console.log(payload)
    axiosClient.post(`/chat/product-description`, payload)
      .then(({ data }) => {
        console.log(data)
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          //setErrors(response.data.errors)
        }
      })
  };

  return (
    <div className="h-screen text-white flex flex-col justify-between mx-6 mt-5">
      <div className="bg-white text-black p-12 rounded-xl">

          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Opis produktu</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Wygeneruj automatycznie opis produktu
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Przedmiot
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="subject"
                        onChange={(event) => setSubject(event.target.value)}
                        value={subject}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Smartfon"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Nazwa produktu
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="subject"
                        onChange={(event) => setProductName(event.target.value)}
                        value={productName}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Xiaomi 13"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Kategoria
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="subject"
                        onChange={(event) => setCategory(event.target.value)}
                        value={category}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Elektronika"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Atrybuty
                  </label>
                  <div className="mt-2">
                    <KeyValue attributes={attributes} setAttributes={setAttributes}  />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Słowa kluczowe
                  </label>
                  <div className="mt-2">
                    <TagsInput value={keywords} onChange={setKeywords} />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Słowa kluczowe - SEO
                  </label>
                  <div className="mt-2">
                    <TagsInput value={keywordsSEO} onChange={setKeywordsSEO} />
                  </div>
                </div>

                <div className="col-span-full">
                  <div className="flex h-6 items-center gap-x-3">
                      <input
                        type="checkbox"
                        checked={useHtml}
                        onChange={(event) => setUseHtml(event.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Wygeneruj wraz z HTML
                      </label>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Grupa odbiorców
                  </label>
                  <div className="mt-2">
                    <select id="countries"
                            value={targetAudience}
                            onChange={(event) => setTargetAudience(event.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option value="all" selected>Wszyscy</option>
                      <option value="man">Mężczyźni</option>
                      <option value="woman">Kobiety</option>
                      <option value="children">Dzieci</option>
                      <option value="senior">Seniorzy</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Styl i ton
                  </label>
                  <div className="mt-2">
                    <TagsInput value={styleAndTone} onChange={setStyleAndTone} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">Np. formalny, zabawny, inspirujący, język potoczny</p>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Ograniczenia produktu
                  </label>
                  <div className="mt-2">
                    <TagsInput value={limitations} onChange={setLimitations} />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Materiał
                  </label>
                  <div className="mt-2">
                    <TagsInput value={material} onChange={setMaterial} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">metal, szkło</p>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Użytkowanie
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="subject"
                        onChange={(event) => setUsage(event.target.value)}
                        value={usage}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="codzienne korzystanie, praca, rozrywka"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Gwarancja
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="warranty"
                        onChange={(event) => setWarranty(event.target.value)}
                        value={warranty}
                        className="block pl-5 flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="2 lata"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Unikalne cechy produktu
                  </label>
                  <div className="mt-2">
                    <TagsInput value={uniqueFeatures} onChange={setUniqueFeatures} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">ładowanie bezprzewodowe, ultraszybki czytnik linii papilarnych</p>
                </div>


                <div className="col-span-full">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Opis (dotychczasowy opis)
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(event) => setDescription(event.target.value)}
                      value={description}
                    />
                  </div>
                </div>



              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>

      </div>
    </div>
  )
}
