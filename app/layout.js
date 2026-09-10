export const metadata = {
  title: "Flow · Business dashboard",
  description: "Payments and finance dashboard for Qatar businesses"
};

const payThemeBoot = `(function(){try{var slug="";var path=location.pathname.replace(/\\/+$/,"");if(path.indexOf("/pay/")===0){slug=decodeURIComponent(path.slice(5).split("/")[0]||"");}else if(path==="/pay"){slug=new URLSearchParams(location.search).get("slug")||"";}if(!slug)return;var data=JSON.parse(localStorage.getItem("flow-live-v1")||"null");if(!data)return;var pages=data.checkoutPages||[];for(var i=0;i<pages.length;i++){if(pages[i].slug===slug&&pages[i].theme==="dark"){document.documentElement.setAttribute("data-pay-theme","dark");return;}}}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: payThemeBoot }} />
        <style>{`html,body{margin:0;min-height:100%;background:#F2F2F5}html[data-pay-theme="dark"],html[data-pay-theme="dark"] body{background:#101014;color:#F4F4F6}`}</style>
      </head>
      <body suppressHydrationWarning style={{ margin: 0, minHeight: "100%" }}>{children}</body>
    </html>
  );
}
