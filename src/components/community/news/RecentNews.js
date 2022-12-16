import React, {useState, useEffect} from "reactn";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { faTrophy, faCrown, faStar } from "@fortawesome/pro-solid-svg-icons";
import moment from "moment-timezone";

import ContentBlock from "../../common/ContentBlock";
import SmallCard from "../../common/SmallCard";
import Loading from "../../common/Loading";
import { useApiGet } from "../../../hooks/useApi";

const RecentNews = () => {
  const { isLoading, data } = useApiGet(
    `recent-news`,
    `/community/news/`,
    null,
    { staleTime: 1000, onError: (err) => toast.error(err.message) }
  );
  const [news, setNews] = useState([]);
  useEffect(() => {
    if (data) {
      setNews(data.rows)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const icons = {
    1: faTrophy,
    2: faCrown,
    3: faStar
  }
  return (
    <>
      {isLoading ? (
        <Loading msg="Loading activity..." />
      ) : (
        <ContentBlock title="Recent News" className="mb-3" fullHeight={false}>
          {
            news.map((item, key) => (
              <SmallCard title={moment.utc(item.community_news_date).format("MM/DD/YYYY @ hh:MM A")} icon={icons[item.community_news_type]} key={key}>
                <p>{item.community_news_details}</p>
              </SmallCard>
            ))
          }
          <Button variant="link" className="m-0 p-0">
            Show More
          </Button>
        </ContentBlock>
      )}
    </>
  );
};

export default RecentNews;
