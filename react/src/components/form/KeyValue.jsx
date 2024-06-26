import {useState} from "react";

export default function KeyValue({attributes, setAttributes}){

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const handleDeleteAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleChangeAttribute = (index, updatedAttribute) => {
    setAttributes(
      attributes.map((attribute, i) =>
        i === index ? { ...attribute, ...updatedAttribute } : attribute
      )
    );
  };

  return (
    <div>
      {attributes.map((attribute, index) => (
        <div key={index} className="flex items-center">
          <div className="w-2/5 border border-gray-100 p-1 rounded m-2">
            <input
              id={`key-${index}`}
              name="key"
              type="text"
              value={attribute.key}
              placeholder="kolor"
              onChange={(e) =>
                handleChangeAttribute(index, { key: e.target.value })
              }
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="w-2/5 border border-gray-100 p-1 rounded m-2">
            <input
              id={`value-${index}`}
              name="value"
              type="text"
              value={attribute.value}
              onChange={(e) =>
                handleChangeAttribute(index, { value: e.target.value })
              }
              placeholder="czarny"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="w-1/5 items-center">
            <button type="button"
                    onClick={() => handleDeleteAttribute(index)}
                    className="bg-red-600 text-white w-full text-center p-2 hover:bg-red-500"
            >Usuń</button>
          </div>
        </div>
      ))}
      <button
        className="bg-gray-600 w-full text-white p-2 rounded"
        onClick={handleAddAttribute}>Dodaj atrybut</button>
    </div>
  )
}
