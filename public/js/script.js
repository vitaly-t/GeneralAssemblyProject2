$(()=>{

  // when search form is submitted
  $('#search').on('submit', (e)=>{
    e.preventDefault();
    const show = $('#search-input').val();
    console.log(show);
    callAPI(show);
  });

  // call your api and get the data
  const callAPI = (title) => {
    $.ajax({
      url: `http://api.tvmaze.com/search/shows?q=${title}`,
      type: 'GET',
      success: data => {
        console.log(data);
        parseShows(data);
      }
    })
  }

  // parse and validate your data. This data may end
  // up in your database so you want to keep it consistent.
  // look at the `seed` file to figure out what values you need
  // what if a result doesn't have an image? a network? a summary?
  const parseShows = (shows) => {
    const parsedShows = shows.reduce((shows, show) => {
      if(show.show){
        shows.push({
          name: show.show.name,
          image: show.show.image ? show.show.image.medium : 'https://c1.staticflickr.com/9/8411/8706485644_dcc5d37b5b_b.jpg',
          network: show.show.network ? show.show.network.name : "N/A",
          summary: show.show.summary ? show.show.summary.replace(/<(?:.|\n)*?>/gm, '') : 'N/A'
        })
      }
      return shows
    }, []);
    renderShows(parsedShows);
  }

  // render your data! Each result should have:
  // name, image, summary, network, and a button that will call
  // createShow()
  const renderShows = (shows) => {
    const $results = $('.results').empty();

    shows.forEach(show => {

      const $show = $('<div>', {
        class: 'show'
      }).appendTo($results);

      const $name = $('<h3>').text(show.name).appendTo($show);

      const $img = $('<img>',{
        src: show.image,
        class: 'show-image'
      }).appendTo($show);

      const $summary = $('<p>').html(show.summary).appendTo($show);

      const $save = $('<button>', {
        id: 'save-show'
      }).text('Save Show').appendTo($show).click(e => {
        createShow(show);
      })
    })
  }

  // this function should preform an ajax call to your post route
  // to add the show to your database
  const createShow = (show) => {
    $.ajax({
      url: '/shows/',
      type: 'POST',
      data: show,
      success: res => {
        window.location.replace(`/shows/${res.show.id}`);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  $('#edit-show').on('submit', (e)=>{
    e.preventDefault();
    const show = {
      name: $('#name-input').val(),
      image: $('#image-input').val(),
      summary: $('#summary-input').val(),
      network: $('#network-input').val(),
      id: $('#id-input').val()
    }
    editShow(show);
  })

  const editShow = (show) => {
    $.ajax({
      url: `/shows/${show.id}`,
      type: 'PUT',
      data: show,
      success: res => {
        console.log(res);
        window.location.replace(`/shows/${res.id}`);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  $('#delete-show').click(e =>{
    deleteShow($(e.target).attr('data-id'));
  })

  const deleteShow = (id) => {
    $.ajax({
      url: `/shows/${id}`,
      type: 'DELETE',
      success: res => {
        console.log(res);
        window.location.replace('/shows/');
      },
      error: err => {
        console.log(err);
      }
    })
  }





})//end of document.ready
