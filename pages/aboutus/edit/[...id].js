import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import AboutUsForm from "@/components/AboutUsForm";
import Spinner from "@/components/Spinner";

export default function EditAboutUsPage() {
  const [aboutUsInfo, setAboutUsInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    axios.get('/api/aboutus?id='+id).then(response => {
      setAboutUsInfo(response.data);
      setIsLoading(false);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Chỉnh sửa nội dung bài viết</h1>
      {isLoading && <Spinner />}
      {aboutUsInfo && <AboutUsForm {...aboutUsInfo} />}
    </Layout>
  );
}