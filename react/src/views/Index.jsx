import {Bars2Icon} from "@heroicons/react/24/solid/index.js";
import AvatarView from "../components/AvatarView.jsx";
import PreviousConversation from "../components/PreviousConversation.jsx";
import axiosClient from "../axios-client.js";
import {generateUniqueId} from "../functions/Helpers.js";
import {useEffect, useState} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import {Link, Navigate} from "react-router-dom";
import Navbar from "../components/utils/Navbar";


export default function Index() {
  const [avatars, setAvatars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    getAvatars();
  }, []);

  const getAvatars = () => {
    axiosClient.get(`/avatars`)
      .then(({data}) => {
        let categoriesSet = new Set();

        data.forEach(item => {
          categoriesSet.add(item.category);
        });

        setCategories(Array.from(categoriesSet))
        setAvatars(data)
      })
  }

  let filteredAvatars = selectedCategory === 'All' ? avatars : avatars.filter(avatar => avatar.category === selectedCategory);
  filteredAvatars.sort((a, b) => a.sort - b.sort);


  //avatars
  return (
    <div className="text-white bg-ai-m mx-5">
      <Navbar />

      <div className="mt-8">
        <div className="text-[2rem] font-semibold">Agents</div>
        <div className="mt-3">
          <div className="flex gap-5 mb-4">
            <div
              onClick={() => setSelectedCategory('All')}
              className={`${selectedCategory == 'All' ? 'text-white' : 'text-ai-disabled'} font-medium cursor-pointer`}>All
              avatars
            </div>
            {categories.map(category => (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${selectedCategory == category ? 'text-white' : 'text-ai-disabled'} font-medium cursor-pointer`}>{category}</div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {filteredAvatars.map(avatar => (
            <div className="mt-3">
              <AvatarView avatar={avatar}/>
            </div>
          ))}
        </div>
      </div>

      {/*<div className="mt-8">*/}
      {/*  <div className="text-[1rem] font-semibold">Previous conversation</div>*/}

      {/*  <div className="flex mt-4">*/}

      {/*    <PreviousConversation />*/}

      {/*  </div>*/}
      {/*</div>*/}

    </div>
  );

}
