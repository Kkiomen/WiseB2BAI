import {Link} from "react-router-dom";

export default function AvatarView({avatar}){
  return (
    <Link to={`/chat/${avatar.short_name}`}>
      <div className="mx-2">
        <img src={avatar.img !== "null"  ? avatar.img : `/img/${avatar.short_name}.jpg`}
             className="rounded-t-2xl w-full"/>
        <div className="bg-ai-m-g rounded-b-2xl p-2 pl-6">
          {avatar.name}
        </div>
      </div>
    </Link>
  );
}
