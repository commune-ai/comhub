import { gradientSectionColors } from './gradientSectionColors'
import { namespacesFeatures } from './namespaces-features'
import { networkingFeatures } from './networking-features'
import { reusabilityFeatures } from './reusability-features'
import { scalabilityFeatures } from './scalability-features'
import { tokenomicsFeatures } from './tokenomics-features'
import { validatorsFeatures } from './validators-features'

export const sections = [
  {
    sectionName: 'networking',
    title: 'Networking & Wrapping Over Everything',
    subtitle: 'Everything You Need',
    color: 'bg-blue-400/[0.03]',
    features: networkingFeatures,
    gradientColor: gradientSectionColors.blue,
    image: '/commune-single-block_blue.gif',
  },
  {
    sectionName: 'reusability',
    title: 'Reusability',
    subtitle: 'Effortless Code Reuse',
    color: 'bg-green-400/[0.03]',
    gradientColor: gradientSectionColors.green,
    features: reusabilityFeatures,
    image: '/commune-single-block_green.gif',

  },
  {
    sectionName: 'scalability',
    title: 'Scalability',
    subtitle: 'Unleash Limitless Growth',
    color: 'bg-yellow-400/[0.03]',
    gradientColor: gradientSectionColors.yellow,
    features: scalabilityFeatures,
    image: '/commune-single-block_yellow.gif',

  },
  {
    sectionName: 'namespaces',
    title: 'Module Namespaces',
    subtitle: 'Simplify Connectivity',
    color: 'bg-red-400/[0.03]',
    gradientColor: gradientSectionColors.red,
    features: namespacesFeatures,
    image: '/commune-single-block_red.gif',

  },
  {
    sectionName: 'tokenomics',
    title: 'Tokenomics',
    subtitle: 'Empowering Honest and Unbiased Voting',
    color: 'bg-pink-400/[0.03]',
    gradientColor: gradientSectionColors.pink,
    features: tokenomicsFeatures,
    image: '/commune-single-block_purple.gif',

  },
  {
    sectionName: 'validators',
    title: 'Application Validators',
    subtitle: 'Rewarding Peak-Performing Modules',
    color: 'bg-cyan-400/[0.03]',
    gradientColor: gradientSectionColors.cyan,
    features: validatorsFeatures,
    image: '/commune-single-block_gray.gif',

  },
]
