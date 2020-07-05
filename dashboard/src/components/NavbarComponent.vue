<template>

  <nav>
    <ul class="navigation">

      <li v-for="(menu, key) in dataSource"
      :class="(menu.collapse?'collapse-show':'collapse-hide') + ' ' + (menu.permalink == hash?'active':'') + ' ' + (menu.hr?'hr':'')">
        <a v-if="!menu.child"
        :href="menu.permalink">
          <i v-if="menu.icon" class="menu-icon" :class="'ti-' + menu.icon"></i>
          {{ menu.title }}
        </a>

        <a v-if="menu.child" @click="toggleCollapse(menu)" href="javascript:">
          <i v-if="menu.icon" class="menu-icon" :class="'ti-' + menu.icon"></i>
          {{ menu.title }}
          <span v-if="menu.child" class="fa arrow"></span>
        </a>

        <ul v-if="menu.child" class="sub-menu collapse" :class="(menu.collapse?'in':'')">
          <li v-for="subMenu in menu.child" :class="subMenu.permalink == hash?'active':''">
            <a :href="subMenu.permalink">
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i v-if="subMenu.icon" class="menu-icon" :class="'ti-' + subMenu.icon"></i>
              {{ subMenu.title }}
            </a>
          </li>
        </ul>
      </li>

    </ul>
  </nav>

</template>

<script>
  export default {

    /************************
    <id="_props">
    ************************/
    props: {

      type: {
        type: String,
        default: 'default',
      },

      dataSource: {
        type: Object,
        default: () => {},
      },

    },

    /************************
    <id="_computed">
    ************************/
    computed: {

      /************************
      <id="_hash">
      ************************/
      hash() {
        return location.hash;
      },

    },

    /************************
    <id="_mounted">
    ************************/
    mounted() {

      $('#menu > nav').height($(window).height() - 162);

      if ($("#menu > nav li.active").length > 0) {
        if ($("#menu > nav li.active").parent().hasClass('sub-menu'))
          var $menu = $("#menu > nav li.active").parent().parent();
        else
          var $menu = $("#menu > nav li.active");

        $('#menu > nav').animate({
          scrollTop: $menu.offset().top - ($('.nav_profile').height() + $('#HeaderLayout').height())
        }, 1000);
      }

    },

    /************************
    <id="_methods">
    ************************/
    methods: {

      /************************
      <id="_toggleCollapse">
      ************************/
      toggleCollapse(menu) {
        menu.collapse = !menu.collapse;
      },

    },

  }
</script>
