import { createRouter, createWebHistory } from "vue-router";

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Account from '../views/Account.vue';
import AccountSettings from '../views/AccountSettings.vue';
import AccountFavorites from '../views/AccountFavorites.vue';
import AccountActivities from '../views/AccountActivities.vue';
import AccountProposals from '../views/AccountProposals.vue';
import ManageActivity from '../views/ManageActivity.vue';
import ManageProposal from '../views/ManageProposal.vue';
import Explore from '../views/Explore.vue';
import Activity from '../views/Activity.vue';
import Participate from '../views/Participate.vue';
import CreateActivity from '../views/CreateActivity.vue';
import CreateProposal from '../views/CreateProposal.vue';

const routes = [
  {
    path: "/",
    redirect: "/login"
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
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/settings',
    name: 'AccountSettings',
    component: AccountSettings,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/favorites',
    name: 'AccountFavorites',
    component: AccountFavorites,
    meta: { requiresAuth: true },
  },
  {
    path: '/account/my-activities',
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
    path: '/explore',
    name: 'Explore',
    component: Explore,
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
    path: '/create/activity',
    name: 'CreateActivity',
    component: CreateActivity,
    meta: { requiresAuth: true },
  },
  {
    path: '/create/proposal',
    name: 'CreateProposal',
    component: CreateProposal,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;