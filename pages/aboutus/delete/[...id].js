import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function DeleteAboutUsPage() {
  const router = useRouter();
  const [aboutUsInfo,setAboutUsInfo] = useState();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/aboutus?id='+id).then(response => {
      setAboutUsInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push('/aboutus');
  }
  async function deleteAboutUs() {
    await axios.delete('/api/aboutus?id=' + id);
    goBack();
  }
  return (
    <Layout>
      <h1 className="text-center">
        Bạn có chắc sẽ xóa: &nbsp;"{aboutUsInfo?.title}" không?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteAboutUs} className="btn-red">
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  );
}