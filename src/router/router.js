import { createRouter, createWebHistory } from "vue-router";

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Home from '../views/Home.vue';
import Explore from '../views/Explore.vue';
import AdvancedFilters from "../views/AdvancedFilters.vue";
import Activity from '../views/Activity.vue';
import CreateActivity from '../views/CreateActivity.vue';
import Conversations from "../views/Conversations.vue";
import Conversation from "../views/Conversation.vue";
import Account from '../views/Account.vue';
import AccountSettings from '../views/AccountSettings.vue';

/*
import AccountFavorites from '../views/AccountFavorites.vue';
import AccountActivities from '../views/AccountActivities.vue';
import AccountProposals from '../views/AccountProposals.vue';
import ManageActivity from '../views/ManageActivity.vue';
import ManageProposal from '../views/ManageProposal.vue';
import Participate from '../views/Participate.vue';
import CreateProposal from '../views/CreateProposal.vue';
*/

import axios from 'axios';

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore,
    meta: { requiresAuth: true },
  },
  {
    path: '/advancedfilters',
    name: 'AdvancedFilters',
    component: AdvancedFilters,
    meta: { requiresAuth: true },
  },
  {
    path: '/activity/:id',
    name: 'Activity',
    component: Activity,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/create/activity',
    name: 'CreateActivity',
    component: CreateActivity,
    meta: { requiresAuth: true },
  },
  {
    path: "/conversations",
    name: "Conversations",
    component: Conversations,
    meta: { requiresAuth: true },
  },
  {
    path: "/conversation/:correspondentId",
    name: "Conversation",
    component: Conversation,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:id',
    name: 'Account',
    component: Account,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/settings',
    name: 'AccountSettings',
    component: AccountSettings,
    meta: { requiresAuth: true },
  },
  /*
  {
    path: '/profile/favorites',
    name: 'AccountFavorites',
    component: AccountFavorites,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/activities',
    name: 'AccountActivities',
    component: AccountActivities,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/my-activites/manage',
    name: 'ManageActivity',
    component: ManageActivity,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/my-proposals',
    name: 'AccountProposals',
    component: AccountProposals,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/my-proposals/manage',
    name: 'ManageProposal',
    component: ManageProposal,
    meta: { requiresAuth: true },
  },
  {
    path: '/participate',
    name: 'Participate',
    component: Participate,
    meta: { requiresAuth: true },
  },
  {
    path: '/create',
    name: 'Create',
    meta: { requiresAuth: true },
  },
  {
    path: '/create/proposal',
    name: 'CreateProposal',
    component: CreateProposal,
    meta: { requiresAuth: true },
  },
  */
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const response = await axios.get(`${import.meta.env.APP_BACK_URL}/auth/verify-session`, { withCredentials: true });
      if (response.status === 200) {
        next();
      } else {
        next({ name: 'Login' });
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification', error);
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router;