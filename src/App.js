import React from "reactn";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { toast } from "react-toastify";

import { init } from "./initGlobals";
import "./reducers";

import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

import Dashboard from "./components/dashboard/Dashboard";
import Calendar from "./components/calendar/Calendar";
import ReferralSources from "./components/referralSources/ReferralSources";
import ReferralSourceProfile from "./components/referralSources/ReferralSourceProfile";
import Map from "./components/map/Map";
import Referrals from "./components/referrals/Referrals";
import ReferralProfile from "./components/referrals/ReferralProfile";
import ReferralLog from "./components/referrals/ReferralLog";

import Community from "./components/community/Community";
import PublicProfile from "./components/community/people/PublicProfile";

import SystemLanding from "./components/system/SystemLanding";
import Users from "./components/system/users/Users";
import User from "./components/system/users/User";
import Organizations from "./components/system/organizations/Organizations";
import BusinessLines from "./components/system/businessLines/BusinessLines";
import Integrations from "./components/system/integrations/Integrations";
import Tools from "./components/system/ai/Tools";
import RulesList from "./components/system/rulesEngine/RulesList";
import Ruleset from "./components/system/rulesEngine/Ruleset";

import SignIn from "./components/auth/SignIn";
import Register from "./components/auth/Register";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const queryClient = new QueryClient();

init();
toast.configure();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/sign-in" component={SignIn} />
          <Route path="/register" component={Register} />

          <PrivateRoute path="/calendar" component={Calendar} />
          <PrivateRoute path="/map" component={Map} />

          <PrivateRoute
            path="/referral-sources/:referralSourceId"
            component={ReferralSourceProfile}
          />
          <PrivateRoute path="/referral-sources" component={ReferralSources} />
          <PrivateRoute
            path="/referrals/:referralId"
            component={ReferralProfile}
          />
          <PrivateRoute path="/referrals" component={Referrals} />
          <PrivateRoute path="/referral-log" component={ReferralLog} />

          <PrivateRoute
            path="/community/people/:userId"
            component={PublicProfile}
          />
          <PrivateRoute path="/community" component={Community} />

          <AdminRoute path="/system/users/:userId" component={User} />
          <AdminRoute path="/system/users" component={Users} />
          <AdminRoute path="/system/organizations" component={Organizations} />
          <AdminRoute path="/system/business-lines" component={BusinessLines} />
          <AdminRoute path="/system/integrations" component={Integrations} />
          <AdminRoute
            path="/system/rules-engine/:rulesetId"
            component={Ruleset}
          />
          <AdminRoute path="/system/rules-engine" component={RulesList} />
          <AdminRoute path="/system/ai-tools" component={Tools} />
          <Route path="/system" component={SystemLanding} />

          <PrivateRoute path="/" component={Dashboard} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
