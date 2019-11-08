const ROLES_FETCHED_EVENT_NAME = 'rolesFetched'
const SENIORITY_TITLES_FETCHED = 'seniorityTitlesFetched'
const TECHNOLOGIES_FETCHED_EVENT_NAME = 'technologiesFetched'

const WEB_DEVELOPER = 'Web Developer'
const ANDROID_DEVELOPER = 'Android Developer'
const IOS_DEVELOPER = 'IOS Developer'
const GAME_DEVELOPER = 'Game Developer'
const MAINFRAME_APPLICATIONS_DEVELOPER = 'Mainframe Applications Developer'
const DATA_SCIENTIST = 'Data Scientist'
const SYSTEMS_DEVELOPER = 'Systems Developer'

const fetchRoles = () => {
  const roles = [WEB_DEVELOPER, ANDROID_DEVELOPER, IOS_DEVELOPER, GAME_DEVELOPER, MAINFRAME_APPLICATIONS_DEVELOPER, DATA_SCIENTIST, SYSTEMS_DEVELOPER]
  roles.sort()
  return roles
}

const fetchSeniorityTitles = () => {
  const titles = ['Trainee', 'Junior', 'Senior', 'Staff', 'Principal', 'Distinguished', 'Fellow']
  return titles
}

const fetchTechnologies = (role) => {
  switch (role) {
    case WEB_DEVELOPER:
      return ['html', 'css', 'javascript', 'design', 'react', 'vue', 'node', 'sql', 'nosql', 'firebase', 'continuous integration', 'webgl', 'webassembly']
    case ANDROID_DEVELOPER:
      return ['design', 'kotlin', 'opengl', 'ar', 'vr']
    case IOS_DEVELOPER:
      return ['design', 'objective-c', 'swift', 'metal', 'ar', 'vr']
    case GAME_DEVELOPER:
      return ['design', 'c++', 'c#', 'lua', 'unity', 'unreal', 'cocos-2d', 'game engine development', 'opengl', 'vulkan', 'artifical intelligence']
    case MAINFRAME_APPLICATIONS_DEVELOPER:
      return ['cobol', 'jcl', 'sql', 'cics', 'ibm utilities']
    case DATA_SCIENTIST:
      return ['python', 'r', 'tensorflow', 'd3']
    case SYSTEMS_DEVELOPER:
      return ['c', 'c++', 'rust', 'haskell', 'python', 'kernel development', 'driver development', 'browser development', 'programming languages development']
    default:
      return []
  }
}

class RolesDispatcher {
    subscribers = []

    addSubscriber (elem) {
      this.subscribers.push(elem)
    }

    nextRoles () {
      const roles = fetchRoles()
      const event = new CustomEvent(ROLES_FETCHED_EVENT_NAME, { detail: { roles } })
      this.subscribers.forEach(s => s.dispatchEvent(event))
    }
}

class SeniorityDispatcher {
    subscribers = []

    addSubscriber (elem) {
      this.subscribers.push(elem)
    }

    nextSeniorityTitles () {
      const titles = fetchSeniorityTitles()
      const event = new CustomEvent(SENIORITY_TITLES_FETCHED, { detail: { titles } })
      this.subscribers.forEach(s => s.dispatchEvent(event))
    }
}

class TechnologiesDispatcher {
    subscribers = []

    addSubscriber (elem) {
      this.subscribers.push(elem)
    }

    nextTechnologies (role) {
      const technologies = fetchTechnologies(role)
      const event = new CustomEvent(TECHNOLOGIES_FETCHED_EVENT_NAME, { detail: { technologies } })
      this.subscribers.forEach(s => s.dispatchEvent(event))
    }
}

const developerRolesDispatcher = new RolesDispatcher()

const seniorityDispatcher = new SeniorityDispatcher()

const technologiesDispatcher = new TechnologiesDispatcher()

const initSurveyForm = (formId) => {
  const form = document.getElementById(formId)

  form.onsubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    for (const entry of formData.entries()) {
      console.log(entry[0], entry[1])
    }

    alert('Thank you for submitting! Please check your console to see the submitted data.')
  }

  // Developer Roles
  const developerRolesSelect = form.querySelector('#dropdown')
  developerRolesDispatcher.addSubscriber(developerRolesSelect)
  developerRolesSelect.addEventListener(ROLES_FETCHED_EVENT_NAME, (e) => {
    developerRolesSelect.innerHTML = ''
    e.detail.roles.forEach(role => {
      const option = document.createElement('option')
      option.setAttribute('value', role)
      option.textContent = role
      developerRolesSelect.appendChild(option)
      seniorityDispatcher.nextSeniorityTitles()
      technologiesDispatcher.nextTechnologies(e.target.value)
    })
  })
  developerRolesSelect.onchange = (e) => {
    seniorityDispatcher.nextSeniorityTitles()
    technologiesDispatcher.nextTechnologies(e.target.value)
  }

  // Seniority
  const seniorityElem = document.getElementById('seniority')
  seniorityDispatcher.addSubscriber(seniorityElem)
  seniorityElem.addEventListener(SENIORITY_TITLES_FETCHED, (e) => {
    seniorityElem.innerHTML = ''
    const explanation = document.createElement('p')
    explanation.textContent = 'What is your seniority current level?'
    seniorityElem.appendChild(explanation)
    const container = document.createElement('div')
    container.className = 'survey-form__button-group'
    e.detail.titles.forEach(title => {
      const div = document.createElement('div')
      div.className = 'survey-form__button-group__button'
      const label = document.createElement('label')
      label.setAttribute('for', title)
      label.textContent = title
      const radioButton = document.createElement('input')
      radioButton.setAttribute('type', 'radio')
      radioButton.setAttribute('name', 'seniority')
      radioButton.setAttribute('value', title)
      div.appendChild(radioButton)
      div.appendChild(label)
      container.appendChild(div)
    })
    seniorityElem.appendChild(container)
  })

  // Technologies
  const technologiesElem = document.getElementById('technologies')
  technologiesDispatcher.addSubscriber(technologiesElem)
  technologiesElem.addEventListener(TECHNOLOGIES_FETCHED_EVENT_NAME, (e) => {
    technologiesElem.innerHTML = ''
    const explanation = document.createElement('p')
    explanation.textContent = 'What do you work with? (Check all that apply)'
    seniorityElem.appendChild(explanation)
    const container = document.createElement('div')
    container.className = 'survey-form__button-group'
    e.detail.technologies.forEach(tech => {
      const div = document.createElement('div')
      div.className = 'survey-form__button-group__button'
      const label = document.createElement('label')
      label.setAttribute('for', tech)
      label.textContent = tech
      const checkbox = document.createElement('input')
      checkbox.setAttribute('type', 'checkbox')
      checkbox.setAttribute('name', 'technologies')
      checkbox.setAttribute('value', tech)
      div.appendChild(checkbox)
      div.appendChild(label)
      container.appendChild(div)
    })
    technologiesElem.appendChild(container)
  })
}

window.onload = () => {
  initSurveyForm('survey-form')
  developerRolesDispatcher.nextRoles()
}
