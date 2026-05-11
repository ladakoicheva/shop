import React, { useEffect, useState } from 'react'
import { changeSettings, getSettings } from '../firebase/db/settings';
import { useStoreContext } from '../store/store';

export default function Setting() {
  const { user } = useStoreContext();
  const [colorText, setColorText] = useState('#121111');
  const [colorBg, setColorBg] = useState('#121111');

  useEffect(() => {

    if (user) {
      syncSettings();
    }
   

  }, [user])


  const syncSettings = async () => {

    const settings = await getSettings(user.uid);
    setColorText(settings.colorText);
    setColorBg(settings.colorBg)
  }

  
  return (
    <div>
      <input type="color" value={colorText} onChange={(e) => setColorText(e.target.value)} />
      <input type="color" value={colorBg} onChange={(e) => setColorBg(e.target.value)} />
      <button onClick={() => {
        changeSettings(user.uid, { colorText, colorBg })
      }}>Get color</button>
    </div>
  )
}
